import { useParams } from '@tanstack/react-router';
import { useGetSession } from '../hooks/useQueries';
import { getRunbookById } from '../lib/runbooks/catalog';
import RunbookStepper from '../components/session/RunbookStepper';
import SessionOutcomeActions from '../components/session/SessionOutcomeActions';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';
import { formatTimestamp } from '../lib/sessionFormatting';

export default function SessionDetailPage() {
  const { sessionId } = useParams({ from: '/session/$sessionId' });
  const { data: session, isLoading, error } = useGetSession(sessionId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('Unauthorized')) {
      return <AccessDeniedScreen message="You don't have permission to view this session." />;
    }
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{errorMessage || 'Failed to load session'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const runbook = getRunbookById(session.runbook.id);
  const isResolved = session.status.__kind__ === 'resolved';
  const isEscalated = session.status.__kind__ === 'escalated';
  const isInProgress = session.status.__kind__ === 'inProgress';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>{runbook?.issueName || 'Troubleshooting Session'}</CardTitle>
                <CardDescription>
                  Started {formatTimestamp(session.createdAt)} • Updated {formatTimestamp(session.updatedAt)}
                </CardDescription>
              </div>
              <Badge variant={isResolved ? 'default' : isEscalated ? 'destructive' : 'secondary'}>
                {isResolved ? 'Resolved' : isEscalated ? 'Escalated' : 'In Progress'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Issue Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{session.issueDescription}</p>
            </div>
          </CardContent>
        </Card>

        {runbook && (
          <RunbookStepper
            runbook={runbook}
            session={session}
            isReadOnly={isResolved || isEscalated}
          />
        )}

        {isInProgress && <SessionOutcomeActions sessionId={session.id} />}
      </div>
    </div>
  );
}
