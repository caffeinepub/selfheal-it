import { useState } from 'react';
import { useMarkResolved, useEscalate, useGetSessionEscalationSummary } from '../../hooks/useQueries';
import { copyToClipboard } from '../../lib/clipboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, AlertTriangle, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SessionOutcomeActionsProps {
  sessionId: string;
}

export default function SessionOutcomeActions({ sessionId }: SessionOutcomeActionsProps) {
  const markResolved = useMarkResolved();
  const escalate = useEscalate();
  const [showEscalationDialog, setShowEscalationDialog] = useState(false);
  const { data: escalationSummary, refetch } = useGetSessionEscalationSummary(
    showEscalationDialog ? sessionId : undefined
  );

  const handleResolve = async () => {
    try {
      await markResolved.mutateAsync(sessionId);
      toast.success('Session marked as resolved');
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark as resolved');
    }
  };

  const handleEscalate = async () => {
    try {
      await escalate.mutateAsync(sessionId);
      await refetch();
      setShowEscalationDialog(true);
      toast.success('Session escalated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to escalate');
    }
  };

  const handleCopySummary = async () => {
    if (escalationSummary) {
      const success = await copyToClipboard(escalationSummary);
      if (success) {
        toast.success('Summary copied to clipboard');
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Session Outcome</CardTitle>
          <CardDescription>Mark this session as resolved or escalate to IT support</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleResolve}
            disabled={markResolved.isPending}
            className="flex-1"
            variant="default"
          >
            {markResolved.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resolving...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Resolved
              </>
            )}
          </Button>
          <Button
            onClick={handleEscalate}
            disabled={escalate.isPending}
            className="flex-1"
            variant="destructive"
          >
            {escalate.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Escalating...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Escalate to IT
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showEscalationDialog} onOpenChange={setShowEscalationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Escalation Summary</DialogTitle>
            <DialogDescription>
              Copy this summary and include it in your IT support ticket
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">{escalationSummary}</pre>
            </div>
            <Button onClick={handleCopySummary} className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Copy Summary
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
