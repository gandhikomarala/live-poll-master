import { Link } from "react-router-dom";
import { Poll } from "@/lib/supabase";
import { ChevronRight, Clock, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PollCardProps {
  poll: Poll;
}

export const PollCard = ({ poll }: PollCardProps) => {
  return (
    <Link to={`/polls/${poll.id}`} className="block">
      <article className="poll-card group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
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
            
            <h3 className="text-lg font-display font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {poll.question}
            </h3>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </article>
    </Link>
  );
};
