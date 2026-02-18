import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useStartSession } from '../hooks/useQueries';
import CategoryPicker from '../components/intake/CategoryPicker';
import SymptomQuestionnaire from '../components/intake/SymptomQuestionnaire';
import { recommendRunbook } from '../lib/recommendation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export default function StartIntakePage() {
  const navigate = useNavigate();
  const startSession = useStartSession();

  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !title.trim()) {
      toast.error('Please select a category and provide a title');
      return;
    }

    const runbookId = recommendRunbook(category, symptoms);
    const issueDescription = `${title}\n\nCategory: ${category}\nSymptoms: ${symptoms.join(', ')}\n\nNotes: ${notes}`;

    try {
      const sessionId = await startSession.mutateAsync({ issueDescription, runbookId });
      toast.success('Troubleshooting session started');
      navigate({ to: '/session/$sessionId', params: { sessionId } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to start session');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/generated/it-support-hero.dim_1600x900.png"
              alt="IT Support"
              className="w-full max-w-2xl rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Start Troubleshooting</h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your issue and we'll guide you through the solution
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Issue Details
            </CardTitle>
            <CardDescription>Provide information about the problem you're experiencing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <CategoryPicker value={category} onChange={setCategory} />
              </div>

              {category && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Brief description of the issue"
                      disabled={startSession.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Symptoms</Label>
                    <SymptomQuestionnaire category={category} value={symptoms} onChange={setSymptoms} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional details that might help..."
                      rows={4}
                      disabled={startSession.isPending}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={startSession.isPending}>
                    {startSession.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting Session...
                      </>
                    ) : (
                      'Start Troubleshooting'
                    )}
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
