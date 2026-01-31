import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { AdminIPTable } from "@/components/AdminIPTable";
import { VoteHistoryTable } from "@/components/VoteHistoryTable";
import { useAuth } from "@/hooks/useAuth";
import { fetchVotedIPs, fetchVoteHistory, Vote, VoteHistory, fetchPolls, Poll } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Shield, Users, History, Search, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<string>("");
  const [votes, setVotes] = useState<Vote[]>([]);
  const [history, setHistory] = useState<VoteHistory[]>([]);
  const [isLoadingPolls, setIsLoadingPolls] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load polls on mount
  useEffect(() => {
    const loadPolls = async () => {
      try {
        const data = await fetchPolls();
        setPolls(data);
        if (data.length > 0) {
          setSelectedPollId(data[0].id.toString());
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingPolls(false);
      }
    };
    loadPolls();
  }, [toast]);

  const loadPollData = useCallback(async () => {
    if (!selectedPollId) return;
    
    setIsLoadingData(true);
    try {
      const pollId = parseInt(selectedPollId);
      const [votesData, historyData] = await Promise.all([
        fetchVotedIPs(pollId),
        fetchVoteHistory(pollId),
      ]);
      setVotes(votesData);
      setHistory(historyData);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  }, [selectedPollId, toast]);

  // Load data when poll changes
  useEffect(() => {
    loadPollData();
  }, [loadPollData]);

  const selectedPoll = polls.find(p => p.id.toString() === selectedPollId);

  if (isLoadingPolls) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Manage votes, release IPs, and view audit history
            </p>
          </div>
        </div>

        {/* Poll Selector */}
        <div className="poll-card mb-8">
          <Label htmlFor="poll-select" className="text-sm font-medium mb-2 block">
            Select Poll
          </Label>
          <Select value={selectedPollId} onValueChange={setSelectedPollId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a poll to manage" />
            </SelectTrigger>
            <SelectContent>
              {polls.map((poll) => (
                <SelectItem key={poll.id} value={poll.id.toString()}>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="truncate max-w-[300px]">{poll.question}</span>
                    {poll.status === "active" && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-success/20 text-success">
                        Live
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPoll && (
          <>
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <div className="stat-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{votes.length}</p>
                    <p className="text-sm text-muted-foreground">Total Votes</p>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-secondary/10">
                    <History className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{history.length}</p>
                    <p className="text-sm text-muted-foreground">History Events</p>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-warning/10">
                    <Shield className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {history.filter(h => h.action === "RELEASE").length}
                    </p>
                    <p className="text-sm text-muted-foreground">IP Releases</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="voters" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="voters" className="gap-2">
                  <Users className="w-4 h-4" />
                  Voted IPs
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <History className="w-4 h-4" />
                  Audit Log
                </TabsTrigger>
              </TabsList>

              <TabsContent value="voters" className="animate-fade-in">
                <div className="poll-card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-display font-semibold">
                      IP Addresses That Voted
                    </h2>
                    <Button variant="outline" size="sm" onClick={loadPollData}>
                      Refresh
                    </Button>
                  </div>
                  
                  {isLoadingData ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <AdminIPTable
                      votes={votes}
                      pollId={parseInt(selectedPollId)}
                      adminId={user?.id || ""}
                      onRelease={loadPollData}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="animate-fade-in">
                <div className="poll-card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-display font-semibold">
                      Vote History (Audit Log)
                    </h2>
                    <Button variant="outline" size="sm" onClick={loadPollData}>
                      Refresh
                    </Button>
                  </div>
                  
                  {isLoadingData ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <VoteHistoryTable history={history} />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {polls.length === 0 && (
          <div className="text-center py-20">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No polls available</h3>
            <p className="text-muted-foreground">
              Create a poll to start managing votes.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
