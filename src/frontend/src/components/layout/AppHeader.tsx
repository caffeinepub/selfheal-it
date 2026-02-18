import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Home, History, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AppHeader() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const queryClient = useQueryClient();
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const currentPath = routerState.location.pathname;

  const handleSignOut = async () => {
    await clear();
    queryClient.clear();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
          {isAuthenticated && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(userProfile.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {identity?.getPrincipal().toString().slice(0, 20)}...
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
