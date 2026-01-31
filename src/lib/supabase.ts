import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

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

// Auth functions
export const signUp = async (email: string, password: string, name?: string) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: { name },
    },
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Role functions
export const getUserRole = async (userId: string): Promise<AppRole | null> => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  
  if (error || !data) return null;
  return data.role as AppRole;
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  const role = await getUserRole(userId);
  return role === "admin";
};

// Poll functions
export const fetchPolls = async (): Promise<Poll[]> => {
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data as Poll[];
};

export const fetchPollWithOptions = async (pollId: number): Promise<PollWithOptions | null> => {
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("*")
    .eq("id", pollId)
    .maybeSingle();
  
  if (pollError) throw pollError;
  if (!poll) return null;

  const { data: options, error: optionsError } = await supabase
    .from("poll_options")
    .select("*")
    .eq("poll_id", pollId)
    .order("id");
  
  if (optionsError) throw optionsError;

  const { data: votes, error: votesError } = await supabase
    .from("votes")
    .select("*")
    .eq("poll_id", pollId);
  
  if (votesError) throw votesError;

  return {
    ...poll,
    options: options as PollOption[],
    votes: votes as Vote[],
  } as PollWithOptions;
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

// Vote functions
export const submitVote = async (
  pollId: number,
  optionId: number,
  userId: string,
  ipAddress: string
): Promise<{ success: boolean; error?: string }> => {
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("poll_id", pollId)
    .eq("ip_address", ipAddress)
    .maybeSingle();

  if (existingVote) {
    return { success: false, error: "You have already voted in this poll" };
  }

  // Insert vote
  const { error: voteError } = await supabase
    .from("votes")
    .insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: userId,
      ip_address: ipAddress,
    });

  if (voteError) {
    if (voteError.code === "23505") {
      return { success: false, error: "You have already voted in this poll" };
    }
    return { success: false, error: voteError.message };
  }

  // Record in history
  await supabase.from("vote_histories").insert({
    poll_id: pollId,
    user_id: userId,
    ip_address: ipAddress,
    new_option_id: optionId,
    action: "VOTE",
    new_voted_at: new Date().toISOString(),
  });

  return { success: true };
};

// Admin functions
export const fetchVotedIPs = async (pollId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("poll_id", pollId)
    .order("voted_at", { ascending: false });
  
  if (error) throw error;
  return data as Vote[];
};

export const releaseIP = async (
  pollId: number,
  ipAddress: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> => {
  // Get the vote to record in history
  const { data: vote } = await supabase
    .from("votes")
    .select("*")
    .eq("poll_id", pollId)
    .eq("ip_address", ipAddress)
    .maybeSingle();

  if (!vote) {
    return { success: false, error: "Vote not found" };
  }

  // Record release in history
  await supabase.from("vote_histories").insert({
    poll_id: pollId,
    user_id: vote.user_id,
    ip_address: ipAddress,
    old_option_id: vote.option_id,
    action: "RELEASE",
    old_voted_at: vote.voted_at,
    performed_by: adminId,
  });

  // Delete the vote
  const { error } = await supabase
    .from("votes")
    .delete()
    .eq("poll_id", pollId)
    .eq("ip_address", ipAddress);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const fetchVoteHistory = async (pollId: number): Promise<VoteHistory[]> => {
  const { data, error } = await supabase
    .from("vote_histories")
    .select("*")
    .eq("poll_id", pollId)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data as VoteHistory[];
};

// Get client IP (fallback)
export const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch {
    return "unknown";
  }
};
