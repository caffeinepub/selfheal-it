import { useState } from 'react';
import type { TroubleshootingSession } from '../../backend';
import type { Runbook } from '../../lib/runbooks/catalog';
import { useCompleteStep } from '../../hooks/useQueries';
import QuickActionPanel from './QuickActionPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { formatTimestamp } from '../../lib/sessionFormatting';
import { toast } from 'sonner';

interface RunbookStepperProps {
  runbook: Runbook;
  session: TroubleshootingSession;
  isReadOnly: boolean;
}

export default function RunbookStepper({ runbook, session, isReadOnly }: RunbookStepperProps) {
  const completeStep = useCompleteStep();
  const [outcome, setOutcome] = useState('');

  const currentStepIndex =
    session.status.__kind__ === 'inProgress' ? Number(session.status.inProgress.currentStep) : runbook.steps.length;
  const results = session.status.__kind__ === 'inProgress' ? session.status.inProgress.results : [];

  const handleCompleteStep = async (stepIndex: number, customOutcome?: string) => {
    const outcomeText = customOutcome || outcome.trim();
    if (!outcomeText) {
      toast.error('Please provide an outcome for this step');
      return;
    }

    try {
      await completeStep.mutateAsync({ sessionId: session.id, outcome: outcomeText });
      setOutcome('');
      toast.success('Step completed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete step');
    }
  };

  return (
    <div className="space-y-4">
      {runbook.steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const result = results.find((r) => r.step.description === step.description);

        return (
          <Card key={index} className={isCurrent && !isReadOnly ? 'ring-2 ring-primary' : ''}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    Step {index + 1}
                    {isCurrent && !isReadOnly && <Badge variant="secondary">Current</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-1">{step.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Expected Outcome:</p>
                <p className="text-sm text-muted-foreground">{step.expectedOutcome}</p>
              </div>

              {step.decisionPoint && (
                <div className="p-3 bg-accent/50 rounded-md">
                  <p className="text-sm font-medium mb-1">Decision Point:</p>
                  <p className="text-sm">{step.decisionPoint}</p>
                </div>
              )}

              {step.quickAction && isCurrent && !isReadOnly && (
                <QuickActionPanel
                  action={step.quickAction}
                  onActionComplete={(outcome) => handleCompleteStep(index, outcome)}
                />
              )}

              {result && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">Outcome:</p>
                  <p className="text-sm mb-2">{result.outcome}</p>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(result.timestamp)}</p>
                </div>
              )}

              {isCurrent && !isReadOnly && !step.quickAction && (
                <div className="space-y-3">
                  <Textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="Describe what happened after completing this step..."
                    rows={3}
                    disabled={completeStep.isPending}
                  />
                  <Button
                    onClick={() => handleCompleteStep(index)}
                    disabled={!outcome.trim() || completeStep.isPending}
                    className="w-full"
                  >
                    {completeStep.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      'Complete Step'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
