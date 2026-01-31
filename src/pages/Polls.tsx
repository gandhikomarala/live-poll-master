import { Header } from "@/components/Header";
import { PollCard } from "@/components/PollCard";
import { usePolls } from "@/hooks/usePolls";
import { Loader2, BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Polls = () => {
  const { polls, isLoading, error, refetch } = usePolls();

  const activePolls = polls.filter((p) => p.status === "active");
  const inactivePolls = polls.filter((p) => p.status === "inactive");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Active Polls
            </h1>
            <p className="text-muted-foreground mt-1">
              Vote on live polls and see real-time results
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-muted mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No polls available
            </h3>
            <p className="text-muted-foreground">
              Check back later for new polls to vote on.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {activePolls.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="live-badge">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-glow" />
                    LIVE
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {activePolls.length} active poll{activePolls.length !== 1 && "s"}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activePolls.map((poll) => (
                    <PollCard key={poll.id} poll={poll} />
                  ))}
                </div>
              </section>
            )}

            {inactivePolls.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                  Closed Polls
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {inactivePolls.map((poll) => (
                    <PollCard key={poll.id} poll={poll} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Polls;
