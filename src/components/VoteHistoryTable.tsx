import { VoteHistory } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface VoteHistoryTableProps {
  history: VoteHistory[];
}

const actionColors: Record<string, string> = {
  VOTE: "bg-success/10 text-success border-success/20",
  RELEASE: "bg-destructive/10 text-destructive border-destructive/20",
  REVOTE: "bg-warning/10 text-warning border-warning/20",
};

export const VoteHistoryTable = ({ history }: VoteHistoryTableProps) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No vote history available for this poll.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Action</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Old Option</TableHead>
            <TableHead>New Option</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("font-mono text-xs", actionColors[entry.action])}
                >
                  {entry.action}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">{entry.ip_address}</TableCell>
              <TableCell className="text-muted-foreground">
                {entry.old_option_id ?? "-"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entry.new_option_id ?? "-"}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {entry.performed_by ? entry.performed_by.slice(0, 8) + "..." : "User"}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(entry.created_at), "MMM d, yyyy HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
