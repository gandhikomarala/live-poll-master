import { PollResult } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ResultsPanelProps {
  results: PollResult[];
  totalVotes: number;
  userVoteOption: number | null;
}

export const ResultsPanel = ({ results, totalVotes, userVoteOption }: ResultsPanelProps) => {
  // Sort by vote count descending
  const sortedResults = [...results].sort((a, b) => b.voteCount - a.voteCount);
  const maxVotes = Math.max(...results.map(r => r.voteCount), 1);

  return (
    <div className="poll-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-card-foreground">
          Live Results
        </h3>
        <div className="live-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-glow" />
          LIVE
        </div>
      </div>

      <div className="space-y-4">
        {sortedResults.map((result, index) => {
          const isUserVote = userVoteOption === result.optionId;
          const isLeading = index === 0 && result.voteCount > 0;

          return (
            <div key={result.optionId} className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "font-medium text-sm",
                    isUserVote && "text-success",
                    isLeading && !isUserVote && "text-primary"
                  )}
                >
                  {result.optionText}
                  {isUserVote && (
                    <span className="ml-2 text-xs opacity-70">(You)</span>
                  )}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {result.voteCount} ({result.percentage.toFixed(1)}%)
                </span>
              </div>
              
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                    isUserVote ? "result-bar-secondary" : "result-bar"
                  )}
                  style={{
                    width: `${(result.voteCount / maxVotes) * 100}%`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total votes</span>
          <span className="font-bold text-foreground">{totalVotes}</span>
        </div>
      </div>
    </div>
  );
};
