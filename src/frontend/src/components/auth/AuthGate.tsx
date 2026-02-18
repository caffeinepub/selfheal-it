import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from './LoginButton';
import ProfileSetupDialog from './ProfileSetupDialog';
import { Loader2, Shield, Zap, Clock } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <img 
                src="/assets/generated/selfheal-logo.dim_512x512.png" 
                alt="SelfHeal IT" 
                className="h-20 w-20"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome to SelfHeal IT</h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Your intelligent IT troubleshooting assistant. Sign in to access guided solutions for common technical issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto my-8">
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-muted/50">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Quick Solutions</h3>
              <p className="text-sm text-muted-foreground">Step-by-step guides for common IT issues</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-muted/50">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Save and resume troubleshooting sessions</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-muted/50">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Secure Access</h3>
              <p className="text-sm text-muted-foreground">Protected by Internet Identity authentication</p>
            </div>
          </div>

          <div className="space-y-4">
            <LoginButton />
            <p className="text-xs text-muted-foreground">
              Secure authentication powered by Internet Identity
            </p>
          </div>
        </div>
      </div>
    );
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetupDialog />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
