import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Home, History } from 'lucide-react';

export default function AppHeader() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const currentPath = routerState.location.pathname;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src="/assets/generated/selfheal-logo.dim_512x512.png" alt="SelfHeal IT" className="h-8 w-8" />
            <span className="font-bold text-lg hidden sm:inline">SelfHeal IT</span>
          </button>

          {isAuthenticated && (
            <nav className="flex items-center gap-2">
              <Button
                variant={currentPath === '/' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => navigate({ to: '/' })}
              >
                <Home className="h-4 w-4 mr-2" />
                Start
              </Button>
              <Button
                variant={currentPath === '/history' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => navigate({ to: '/history' })}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile && (
            <span className="text-sm text-muted-foreground hidden sm:inline">Hello, {userProfile.name}</span>
          )}
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
