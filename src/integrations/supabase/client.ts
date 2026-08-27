// Self-contained Local Client with Real-time BroadcastChannel support
// Eliminates all external APIs and provides 100% offline functionality.

type Listener = (event: string, session: any) => void;

class LocalAuthClient {
  private listeners: Set<Listener> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("pollmonitor-auth-change", () => {
        const session = this.getSessionSync();
        this.listeners.forEach((fn) => fn("SIGNED_IN", session));
      });
    }
  }

  getSessionSync() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("pollmonitor_session");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async getSession() {
    const session = this.getSessionSync();
    return { data: { session }, error: null };
  }

  onAuthStateChange(callback: Listener) {
    this.listeners.add(callback);
    const session = this.getSessionSync();
    callback(session ? "SIGNED_IN" : "INITIAL_SESSION", session);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners.delete(callback);
          },
        },
      },
    };
  }

  async signInWithPassword({ email, password }: { email: string; password?: string }) {
    const rawUsers = localStorage.getItem("pollmonitor_users") || "[]";
    const users = JSON.parse(rawUsers);
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      const newUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
        role: email.toLowerCase().includes("admin") ? "admin" : "user",
        created_at: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem("pollmonitor_users", JSON.stringify(users));
      const session = { user: newUser, access_token: "local-token-" + newUser.id };
      localStorage.setItem("pollmonitor_session", JSON.stringify(session));
      window.dispatchEvent(new Event("pollmonitor-auth-change"));
      return { data: { user: newUser, session }, error: null };
    }

    const session = { user, access_token: "local-token-" + user.id };
    localStorage.setItem("pollmonitor_session", JSON.stringify(session));
    window.dispatchEvent(new Event("pollmonitor-auth-change"));
    return { data: { user, session }, error: null };
  }

  async signUp({ email, password, options }: { email: string; password?: string; options?: any }) {
    const rawUsers = localStorage.getItem("pollmonitor_users") || "[]";
    const users = JSON.parse(rawUsers);

    const newUser = {
      id: "user-" + Math.random().toString(36).substr(2, 9),
      email,
      name: options?.data?.name || email.split("@")[0],
      role: email.toLowerCase().includes("admin") ? "admin" : "user",
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("pollmonitor_users", JSON.stringify(users));

    const session = { user: newUser, access_token: "local-token-" + newUser.id };
    localStorage.setItem("pollmonitor_session", JSON.stringify(session));
    window.dispatchEvent(new Event("pollmonitor-auth-change"));

    return { data: { user: newUser, session }, error: null };
  }

  async signOut() {
    localStorage.removeItem("pollmonitor_session");
    window.dispatchEvent(new Event("pollmonitor-auth-change"));
    return { error: null };
  }
}

class LocalChannel {
  private channelName: string;
  private bc: BroadcastChannel | null = null;
  private listeners: Map<string, Array<() => void>> = new Map();

  constructor(name: string) {
    this.channelName = name;
    if (typeof BroadcastChannel !== "undefined") {
      this.bc = new BroadcastChannel("pollmonitor-channel-" + name);
      this.bc.onmessage = (event) => {
        const callbacks = this.listeners.get(event.data?.type || "*") || [];
        callbacks.forEach((cb) => cb());
      };
    }

    if (typeof window !== "undefined") {
      window.addEventListener("pollmonitor-local-broadcast", ((e: CustomEvent) => {
        if (e.detail?.channel === this.channelName) {
          const callbacks = this.listeners.get(e.detail?.type || "*") || [];
          callbacks.forEach((cb) => cb());
        }
      }) as EventListener);
    }
  }

  on(type: string, filter: any, callback: () => void) {
    const list = this.listeners.get("*") || [];
    list.push(callback);
    this.listeners.set("*", list);
    return this;
  }

  subscribe() {
    return this;
  }

  close() {
    if (this.bc) {
      this.bc.close();
    }
  }
}

export class LocalSupabaseClient {
  auth = new LocalAuthClient();

  channel(name: string) {
    return new LocalChannel(name);
  }

  removeChannel(channel: LocalChannel) {
    channel.close();
  }

  from(table: string) {
    return {
      select: (fields?: string) => ({
        eq: (col: string, val: any) => ({
          maybeSingle: async () => {
            if (table === "user_roles") {
              const raw = localStorage.getItem("pollmonitor_users") || "[]";
              const users = JSON.parse(raw);
              const u = users.find((item: any) => item.id === val);
              return { data: u ? { role: u.role } : null, error: null };
            }
            return { data: null, error: null };
          },
        }),
      }),
    };
  }
}

export const supabase = new LocalSupabaseClient() as any;
