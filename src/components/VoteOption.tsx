import { PollOption } from "@/lib/supabase";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteOptionProps {
  option: PollOption;
  isSelected: boolean;
  hasVoted: boolean;
  userVoteOption: number | null;
  onSelect: (optionId: number) => void;
}

export const VoteOption = ({
  option,
  isSelected,
  hasVoted,
  userVoteOption,
  onSelect,
}: VoteOptionProps) => {
  const isUserVote = userVoteOption === option.id;
  const isDisabled = hasVoted;

  return (
    <button
      type="button"
      onClick={() => !isDisabled && onSelect(option.id)}
      disabled={isDisabled}
      className={cn(
        "vote-option w-full text-left",
        isSelected && "selected",
        isUserVote && "border-success bg-success/10",
        isDisabled && !isUserVote && "opacity-60 cursor-not-allowed"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors",
          isSelected ? "border-primary bg-primary" : "border-muted-foreground/30",
          isUserVote && "border-success bg-success"
        )}
      >
        {isSelected || isUserVote ? (
          <Check className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Circle className="w-3 h-3 text-transparent" />
        )}
      </div>
      
      <span
        className={cn(
          "flex-1 font-medium",
          isUserVote && "text-success"
        )}
      >
        {option.option_text}
      </span>
      
      {isUserVote && (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-success/20 text-success">
          Your vote
        </span>
      )}
    </button>
  );
};
