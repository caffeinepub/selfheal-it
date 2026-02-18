import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useListUserSessions } from '../hooks/useQueries';
import HistoryFilters from '../components/history/HistoryFilters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';
import { formatTimestamp } from '../lib/sessionFormatting';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { data: sessions = [], isLoading } = useListUserSessions();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'inProgress' && session.status.__kind__ === 'inProgress') ||
        (statusFilter === 'resolved' && session.status.__kind__ === 'resolved') ||
        (statusFilter === 'escalated' && session.status.__kind__ === 'escalated');

      const categoryMatch = session.issueDescription.match(/Category: ([^\n]+)/);
      const category = categoryMatch ? categoryMatch[1] : '';
      const matchesCategory = categoryFilter === 'all' || category === categoryFilter;

      const matchesSearch =
        searchQuery === '' ||
        session.issueDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.runbook.issueName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [sessions, statusFilter, categoryFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Session History</h1>
          <p className="text-muted-foreground">Review your past troubleshooting sessions</p>
        </div>

        <HistoryFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
                <p className="text-muted-foreground mb-4">
                  {sessions.length === 0
                    ? "You haven't started any troubleshooting sessions yet"
                    : 'Try adjusting your filters'}
                </p>
                {sessions.length === 0 && (
                  <Button onClick={() => navigate({ to: '/' })}>Start Your First Session</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredSessions.map((session) => {
              const isResolved = session.status.__kind__ === 'resolved';
              const isEscalated = session.status.__kind__ === 'escalated';
              const titleMatch = session.issueDescription.match(/^([^\n]+)/);
              const title = titleMatch ? titleMatch[1] : 'Untitled Session';

              return (
                <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader onClick={() => navigate({ to: '/session/$sessionId', params: { sessionId: session.id } })}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{session.runbook.issueName}</CardTitle>
                        <CardDescription>{title}</CardDescription>
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(session.createdAt)}
                        </div>
                      </div>
                      <Badge variant={isResolved ? 'default' : isEscalated ? 'destructive' : 'secondary'}>
                        {isResolved ? 'Resolved' : isEscalated ? 'Escalated' : 'In Progress'}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
