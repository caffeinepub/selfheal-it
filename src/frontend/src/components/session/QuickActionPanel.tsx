import { useState } from 'react';
import type { QuickAction } from '../../lib/runbooks/catalog';
import { copyToClipboard } from '../../lib/clipboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, CheckCircle, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuickActionPanelProps {
  action: QuickAction;
  onActionComplete: (outcome: string) => void;
}

export default function QuickActionPanel({ action, onActionComplete }: QuickActionPanelProps) {
  const [copied, setCopied] = useState(false);
  const [outcome, setOutcome] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const handleCopy = async () => {
    if (action.type === 'command' && action.command) {
      const success = await copyToClipboard(action.command);
      if (success) {
        setCopied(true);
        toast.success('Command copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleComplete = async () => {
    if (!outcome.trim()) {
      toast.error('Please describe the outcome');
      return;
    }
    setIsCompleting(true);
    await onActionComplete(outcome);
    setIsCompleting(false);
  };

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Quick Action (Guided)
        </CardTitle>
        <CardDescription>Follow these instructions on your device</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {action.type === 'command' && action.command && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Command to run:</p>
            <div className="flex gap-2">
              <code className="flex-1 p-3 bg-muted rounded text-sm font-mono break-all">{action.command}</code>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        {action.instructions && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Instructions:</p>
            <div className="p-3 bg-muted rounded text-sm whitespace-pre-wrap">{action.instructions}</div>
          </div>
        )}

        <div className="pt-2 border-t space-y-3">
          <Textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="After following the instructions, describe what happened..."
            rows={3}
            disabled={isCompleting}
          />
          <Button onClick={handleComplete} disabled={!outcome.trim() || isCompleting} className="w-full">
            {isCompleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording...
              </>
            ) : (
              'Record Outcome'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
