import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Poll,
  PollWithOptions,
  PollResult,
  Vote,
  fetchPolls,
  fetchPollWithOptions,
  calculateResults,
  submitVote,
  getClientIP,
} from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const usePolls = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPolls = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchPolls();
      setPolls(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  return { polls, isLoading, error, refetch: loadPolls };
};

export const usePollDetail = (pollId: number | null) => {
  const [poll, setPoll] = useState<PollWithOptions | null>(null);
  const [results, setResults] = useState<PollResult[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVoteOption, setUserVoteOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [clientIP, setClientIP] = useState<string>("");
  const { toast } = useToast();

  const loadPoll = useCallback(async () => {
    if (!pollId) return;
    
    try {
      setIsLoading(true);
      const [data, ip] = await Promise.all([
        fetchPollWithOptions(pollId),
        getClientIP(),
      ]);
      
      setClientIP(ip);
      
      if (data) {
        setPoll(data);
        setResults(calculateResults(data.options, data.votes));
        
        // Check if current IP has voted
        const userVote = data.votes.find(v => v.ip_address === ip);
        setHasVoted(!!userVote);
        setUserVoteOption(userVote?.option_id ?? null);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pollId, toast]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!pollId) return;

    const channel = supabase
      .channel(`poll-${pollId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          filter: `poll_id=eq.${pollId}`,
        },
        async () => {
          // Refresh poll data on any vote change
          const data = await fetchPollWithOptions(pollId);
          if (data) {
            setPoll(data);
            setResults(calculateResults(data.options, data.votes));
            
            const userVote = data.votes.find(v => v.ip_address === clientIP);
            setHasVoted(!!userVote);
            setUserVoteOption(userVote?.option_id ?? null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId, clientIP]);

  useEffect(() => {
    loadPoll();
  }, [loadPoll]);

  const vote = async (optionId: number, userId: string) => {
    if (!pollId || !clientIP) return;
    
    setIsVoting(true);
    try {
      const result = await submitVote(pollId, optionId, userId, clientIP);
      
      if (result.success) {
        toast({
          title: "Vote recorded!",
          description: "Your vote has been submitted successfully.",
        });
        setHasVoted(true);
        setUserVoteOption(optionId);
        await loadPoll();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  return {
    poll,
    results,
    hasVoted,
    userVoteOption,
    isLoading,
    isVoting,
    clientIP,
    vote,
    refetch: loadPoll,
  };
};
