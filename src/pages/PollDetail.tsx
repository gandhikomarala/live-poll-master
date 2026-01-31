import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { VoteOption } from "@/components/VoteOption";
import { ResultsPanel } from "@/components/ResultsPanel";
import { usePollDetail } from "@/hooks/usePolls";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Check, AlertCircle } from "lucide-react";

const PollDetail = () => {
  const { pollId } = useParams<{ pollId: string }>();
  const { user } = useAuth();
  const {
    poll,
    results,
    hasVoted,
    userVoteOption,
    isLoading,
    isVoting,
    vote,
  } = usePollDetail(pollId ? parseInt(pollId) : null);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleVote = async () => {
    if (!selectedOption || !user) return;
    await vote(selectedOption, user.id);
  };

  const totalVotes = results.reduce((sum, r) => sum + r.voteCount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Poll not found</h2>
            <p className="text-muted-foreground mb-6">
              This poll may have been deleted or doesn't exist.
            </p>
            <Link to="/polls">
              <Button>Back to Polls</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Link
          to="/polls"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to polls
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Voting Section */}
          <div className="lg:col-span-3">
            <div className="poll-card">
              <div className="flex items-center gap-2 mb-4">
                {poll.status === "active" && (
                  <span className="live-badge">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-glow" />
                    LIVE
                  </span>
                )}
                {poll.status === "inactive" && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    Closed
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-display font-bold text-card-foreground mb-6">
                {poll.question}
              </h1>

              {hasVoted && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-success/10 border border-success/20 mb-6">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-success font-medium">
                    You have already voted in this poll
                  </span>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {poll.options.map((option) => (
                  <VoteOption
                    key={option.id}
                    option={option}
                    isSelected={selectedOption === option.id}
                    hasVoted={hasVoted}
                    userVoteOption={userVoteOption}
                    onSelect={setSelectedOption}
                  />
                ))}
              </div>

              {!hasVoted && poll.status === "active" && (
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedOption || isVoting}
                  onClick={handleVote}
                >
                  {isVoting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Vote"
                  )}
                </Button>
              )}

              {poll.status === "inactive" && (
                <p className="text-center text-muted-foreground">
                  This poll is closed. Voting is no longer available.
                </p>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <ResultsPanel
              results={results}
              totalVotes={totalVotes}
              userVoteOption={userVoteOption}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PollDetail;
