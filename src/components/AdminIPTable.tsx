import { useState } from "react";
import { Vote, releaseIP } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminIPTableProps {
  votes: Vote[];
  pollId: number;
  adminId: string;
  onRelease: () => void;
}

export const AdminIPTable = ({ votes, pollId, adminId, onRelease }: AdminIPTableProps) => {
  const [releasingIP, setReleasingIP] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRelease = async (ipAddress: string) => {
    setReleasingIP(ipAddress);
    try {
      const result = await releaseIP(pollId, ipAddress, adminId);
      
      if (result.success) {
        toast({
          title: "IP Released",
          description: `IP ${ipAddress} has been released and can vote again.`,
        });
        onRelease();
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
      setReleasingIP(null);
    }
  };

  if (votes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No votes recorded for this poll yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>IP Address</TableHead>
            <TableHead>Option ID</TableHead>
            <TableHead>Voted At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {votes.map((vote) => (
            <TableRow key={vote.id}>
              <TableCell className="font-mono text-sm">{vote.ip_address}</TableCell>
              <TableCell>{vote.option_id}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(vote.voted_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={releasingIP === vote.ip_address}
                    >
                      {releasingIP === vote.ip_address ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Release
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        Release IP Address
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete the vote from IP <code className="font-mono bg-muted px-1 rounded">{vote.ip_address}</code> and allow them to vote again. This action is recorded in the audit log.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRelease(vote.ip_address)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Release IP
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
