import { supabase } from "@/integrations/supabase/client";

export { supabase };

export type AppRole = "admin" | "user";

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  created_at: string;
}

export interface Poll {
  id: number;
  question: string;
  status: "active" | "inactive";
  created_by: string | null;
  created_at: string;
}

export interface PollOption {
  id: number;
  poll_id: number;
  option_text: string;
  created_at: string;
}

export interface Vote {
  id: number;
  poll_id: number;
  option_id: number;
  user_id: string;
  ip_address: string;
  voted_at: string;
  created_at: string;
}

export interface VoteHistory {
  id: number;
  poll_id: number;
  user_id: string | null;
  ip_address: string;
  old_option_id: number | null;
  new_option_id: number | null;
  action: "VOTE" | "RELEASE" | "REVOTE";
  old_voted_at: string | null;
  new_voted_at: string | null;
  performed_by: string | null;
  created_at: string;
}

export interface PollWithOptions extends Poll {
  options: PollOption[];
  votes: Vote[];
}

export interface PollResult {
  optionId: number;
  optionText: string;
  voteCount: number;
  percentage: number;
}

// -------------------------------------------------------------
// LOCAL REAL-TIME DATABASE ENGINE & AUTO-SEEDING
// -------------------------------------------------------------

const DEFAULT_POLLS: Poll[] = [
  {
    id: 1,
    question: "Which frontend architecture does your team prefer for 2026?",
    status: "active",
    created_by: "admin-1",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 2,
    question: "What is your primary enterprise cloud provider?",
    status: "active",
    created_by: "admin-1",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 3,
    question: "How frequently does your engineering team deploy to production?",
    status: "active",
    created_by: "admin-1",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 4,
    question: "Previous Quarter Retrospective: Remote vs Hybrid Workplace Policy",
    status: "inactive",
    created_by: "admin-1",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
];

const DEFAULT_OPTIONS: PollOption[] = [
  // Poll 1
  { id: 1, poll_id: 1, option_text: "React 19 & Next.js App Router", created_at: new Date().toISOString() },
  { id: 2, poll_id: 1, option_text: "Vue 3 & Nuxt Framework", created_at: new Date().toISOString() },
  { id: 3, poll_id: 1, option_text: "Svelte 5 & SvelteKit", created_at: new Date().toISOString() },
  { id: 4, poll_id: 1, option_text: "Astro & Component Islands", created_at: new Date().toISOString() },

  // Poll 2
  { id: 5, poll_id: 2, option_text: "Amazon Web Services (AWS)", created_at: new Date().toISOString() },
  { id: 6, poll_id: 2, option_text: "Google Cloud Platform (GCP)", created_at: new Date().toISOString() },
  { id: 7, poll_id: 2, option_text: "Microsoft Azure", created_at: new Date().toISOString() },
  { id: 8, poll_id: 2, option_text: "Self-Hosted Kubernetes / Bare Metal", created_at: new Date().toISOString() },

  // Poll 3
  { id: 9, poll_id: 3, option_text: "Multiple times per day (Continuous Deployment)", created_at: new Date().toISOString() },
  { id: 10, poll_id: 3, option_text: "Daily scheduled releases", created_at: new Date().toISOString() },
  { id: 11, poll_id: 3, option_text: "Weekly sprint cycles", created_at: new Date().toISOString() },
  { id: 12, poll_id: 3, option_text: "Bi-weekly / Monthly releases", created_at: new Date().toISOString() },

  // Poll 4
  { id: 13, poll_id: 4, option_text: "100% Fully Remote", created_at: new Date().toISOString() },
  { id: 14, poll_id: 4, option_text: "Flexible Hybrid (2-3 days office)", created_at: new Date().toISOString() },
  { id: 15, poll_id: 4, option_text: "Office-First / On-site", created_at: new Date().toISOString() },
];

const DEFAULT_VOTES: Vote[] = [
  { id: 1, poll_id: 1, option_id: 1, user_id: "u-101", ip_address: "192.168.1.101", voted_at: new Date(Date.now() - 3600000 * 5).toISOString(), created_at: new Date().toISOString() },
  { id: 2, poll_id: 1, option_id: 1, user_id: "u-102", ip_address: "192.168.1.102", voted_at: new Date(Date.now() - 3600000 * 4).toISOString(), created_at: new Date().toISOString() },
  { id: 3, poll_id: 1, option_id: 3, user_id: "u-103", ip_address: "192.168.1.103", voted_at: new Date(Date.now() - 3600000 * 3).toISOString(), created_at: new Date().toISOString() },
  { id: 4, poll_id: 1, option_id: 2, user_id: "u-104", ip_address: "192.168.1.104", voted_at: new Date(Date.now() - 3600000 * 2).toISOString(), created_at: new Date().toISOString() },
  { id: 5, poll_id: 2, option_id: 5, user_id: "u-101", ip_address: "192.168.1.101", voted_at: new Date(Date.now() - 3600000 * 6).toISOString(), created_at: new Date().toISOString() },
  { id: 6, poll_id: 2, option_id: 6, user_id: "u-102", ip_address: "192.168.1.102", voted_at: new Date(Date.now() - 3600000 * 5).toISOString(), created_at: new Date().toISOString() },
  { id: 7, poll_id: 3, option_id: 9, user_id: "u-101", ip_address: "192.168.1.101", voted_at: new Date(Date.now() - 3600000 * 8).toISOString(), created_at: new Date().toISOString() },
];

const DEFAULT_HISTORY: VoteHistory[] = [
  { id: 1, poll_id: 1, user_id: "u-101", ip_address: "192.168.1.101", old_option_id: null, new_option_id: 1, action: "VOTE", old_voted_at: null, new_voted_at: new Date(Date.now() - 3600000 * 5).toISOString(), performed_by: null, created_at: new Date().toISOString() },
  { id: 2, poll_id: 1, user_id: "u-102", ip_address: "192.168.1.102", old_option_id: null, new_option_id: 1, action: "VOTE", old_voted_at: null, new_voted_at: new Date(Date.now() - 3600000 * 4).toISOString(), performed_by: null, created_at: new Date().toISOString() },
  { id: 3, poll_id: 1, user_id: "u-103", ip_address: "192.168.1.103", old_option_id: null, new_option_id: 3, action: "VOTE", old_voted_at: null, new_voted_at: new Date(Date.now() - 3600000 * 3).toISOString(), performed_by: null, created_at: new Date().toISOString() },
];

const initDb = () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("pollmonitor_polls")) {
    localStorage.setItem("pollmonitor_polls", JSON.stringify(DEFAULT_POLLS));
  }
  if (!localStorage.getItem("pollmonitor_options")) {
    localStorage.setItem("pollmonitor_options", JSON.stringify(DEFAULT_OPTIONS));
  }
  if (!localStorage.getItem("pollmonitor_votes")) {
    localStorage.setItem("pollmonitor_votes", JSON.stringify(DEFAULT_VOTES));
  }
  if (!localStorage.getItem("pollmonitor_history")) {
    localStorage.setItem("pollmonitor_history", JSON.stringify(DEFAULT_HISTORY));
  }
  if (!localStorage.getItem("pollmonitor_users")) {
    const defaultUsers = [
      { id: "admin-1", email: "admin@pollmonitor.io", name: "System Admin", role: "admin", created_at: new Date().toISOString() },
      { id: "user-1", email: "voter@pollmonitor.io", name: "Demo Voter", role: "user", created_at: new Date().toISOString() },
    ];
    localStorage.setItem("pollmonitor_users", JSON.stringify(defaultUsers));
  }
};

initDb();

const broadcastChange = (pollId?: number) => {
  if (typeof window === "undefined") return;
  const channelName = pollId ? `poll-${pollId}` : "poll-global";
  
  if (typeof BroadcastChannel !== "undefined") {
    try {
      const bc = new BroadcastChannel("pollmonitor-channel-" + channelName);
      bc.postMessage({ type: "postgres_changes", pollId });
      bc.close();
    } catch {}
  }

  window.dispatchEvent(new CustomEvent("pollmonitor-local-broadcast", {
    detail: { channel: channelName, type: "postgres_changes", pollId }
  }));
};

// -------------------------------------------------------------
// AUTH FUNCTIONS (100% Standalone)
// -------------------------------------------------------------

export const signUp = async (email: string, password?: string, name?: string) => {
  return await supabase.auth.signUp({ email, password, options: { data: { name } } });
};

export const signIn = async (email: string, password?: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getUserRole = async (userId: string): Promise<AppRole | null> => {
  const raw = localStorage.getItem("pollmonitor_users") || "[]";
  const users = JSON.parse(raw);
  const u = users.find((item: any) => item.id === userId);
  return (u?.role as AppRole) || "user";
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  const role = await getUserRole(userId);
  return role === "admin";
};

// -------------------------------------------------------------
// POLL FUNCTIONS (Local Engine)
// -------------------------------------------------------------

export const fetchPolls = async (): Promise<Poll[]> => {
  initDb();
  const raw = localStorage.getItem("pollmonitor_polls") || "[]";
  const polls = JSON.parse(raw);
  return polls.sort((a: Poll, b: Poll) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const fetchPollWithOptions = async (pollId: number): Promise<PollWithOptions | null> => {
  initDb();
  const polls: Poll[] = JSON.parse(localStorage.getItem("pollmonitor_polls") || "[]");
  const poll = polls.find(p => p.id === pollId);
  if (!poll) return null;

  const allOptions: PollOption[] = JSON.parse(localStorage.getItem("pollmonitor_options") || "[]");
  const options = allOptions.filter(o => o.poll_id === pollId).sort((a, b) => a.id - b.id);

  const allVotes: Vote[] = JSON.parse(localStorage.getItem("pollmonitor_votes") || "[]");
  const votes = allVotes.filter(v => v.poll_id === pollId);

  return {
    ...poll,
    options,
    votes,
  };
};

export const calculateResults = (options: PollOption[], votes: Vote[]): PollResult[] => {
  const totalVotes = votes.length;
  return options.map(option => {
    const voteCount = votes.filter(v => v.option_id === option.id).length;
    const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
    return {
      optionId: option.id,
      optionText: option.option_text,
      voteCount,
      percentage,
    };
  });
};

// -------------------------------------------------------------
// VOTE FUNCTIONS
// -------------------------------------------------------------

export const submitVote = async (
  pollId: number,
  optionId: number,
  userId: string,
  ipAddress: string
): Promise<{ success: boolean; error?: string }> => {
  initDb();
  const allVotes: Vote[] = JSON.parse(localStorage.getItem("pollmonitor_votes") || "[]");
  
  // Check if IP already voted
  const existingVote = allVotes.find(v => v.poll_id === pollId && v.ip_address === ipAddress);
  if (existingVote) {
    return { success: false, error: "You have already voted in this poll" };
  }

  const newVote: Vote = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    poll_id: pollId,
    option_id: optionId,
    user_id: userId,
    ip_address: ipAddress,
    voted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  allVotes.push(newVote);
  localStorage.setItem("pollmonitor_votes", JSON.stringify(allVotes));

  // Record history
  const allHistory: VoteHistory[] = JSON.parse(localStorage.getItem("pollmonitor_history") || "[]");
  const historyEntry: VoteHistory = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    poll_id: pollId,
    user_id: userId,
    ip_address: ipAddress,
    old_option_id: null,
    new_option_id: optionId,
    action: "VOTE",
    old_voted_at: null,
    new_voted_at: newVote.voted_at,
    performed_by: null,
    created_at: new Date().toISOString(),
  };
  allHistory.unshift(historyEntry);
  localStorage.setItem("pollmonitor_history", JSON.stringify(allHistory));

  broadcastChange(pollId);
  return { success: true };
};

// -------------------------------------------------------------
// ADMIN FUNCTIONS (IP Release & Audit)
// -------------------------------------------------------------

export const fetchVotedIPs = async (pollId: number): Promise<Vote[]> => {
  initDb();
  const allVotes: Vote[] = JSON.parse(localStorage.getItem("pollmonitor_votes") || "[]");
  return allVotes
    .filter(v => v.poll_id === pollId)
    .sort((a, b) => new Date(b.voted_at).getTime() - new Date(a.voted_at).getTime());
};

export const releaseIP = async (
  pollId: number,
  ipAddress: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> => {
  initDb();
  let allVotes: Vote[] = JSON.parse(localStorage.getItem("pollmonitor_votes") || "[]");
  const vote = allVotes.find(v => v.poll_id === pollId && v.ip_address === ipAddress);

  if (!vote) {
    return { success: false, error: "Vote not found" };
  }

  // Record release event in audit history
  const allHistory: VoteHistory[] = JSON.parse(localStorage.getItem("pollmonitor_history") || "[]");
  const historyEntry: VoteHistory = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    poll_id: pollId,
    user_id: vote.user_id,
    ip_address: ipAddress,
    old_option_id: vote.option_id,
    new_option_id: null,
    action: "RELEASE",
    old_voted_at: vote.voted_at,
    new_voted_at: null,
    performed_by: adminId,
    created_at: new Date().toISOString(),
  };
  allHistory.unshift(historyEntry);
  localStorage.setItem("pollmonitor_history", JSON.stringify(allHistory));

  // Delete the vote
  allVotes = allVotes.filter(v => !(v.poll_id === pollId && v.ip_address === ipAddress));
  localStorage.setItem("pollmonitor_votes", JSON.stringify(allVotes));

  broadcastChange(pollId);
  return { success: true };
};

export const fetchVoteHistory = async (pollId: number): Promise<VoteHistory[]> => {
  initDb();
  const allHistory: VoteHistory[] = JSON.parse(localStorage.getItem("pollmonitor_history") || "[]");
  return allHistory
    .filter(h => h.poll_id === pollId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// -------------------------------------------------------------
// LOCAL CLIENT IP GENERATOR (Zero External API Calls)
// -------------------------------------------------------------

export const getClientIP = async (): Promise<string> => {
  if (typeof window === "undefined") return "127.0.0.1";
  
  let ip = localStorage.getItem("pollmonitor_client_ip");
  if (!ip) {
    // Generate a consistent pseudo-local IP for this browser session
    const rand = Math.floor(Math.random() * 200) + 10;
    ip = `192.168.1.${rand}`;
    localStorage.setItem("pollmonitor_client_ip", ip);
  }
  return ip;
};
