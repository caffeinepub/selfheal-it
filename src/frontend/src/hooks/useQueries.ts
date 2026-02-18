import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { TroubleshootingSession, UserProfile, Runbook, SessionStatus } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useStartSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issueDescription, runbookId }: { issueDescription: string; runbookId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startSession(issueDescription, runbookId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
    },
  });
}

export function useGetSession(sessionId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TroubleshootingSession>({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) throw new Error('Actor or sessionId not available');
      return actor.getSession(sessionId);
    },
    enabled: !!actor && !actorFetching && !!sessionId,
    retry: false,
  });
}

export function useCompleteStep() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, outcome }: { sessionId: string; outcome: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeStep(sessionId, outcome);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
    },
  });
}

export function useMarkResolved() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markResolved(sessionId);
    },
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
    },
  });
}

export function useEscalate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.escalate(sessionId);
    },
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
    },
  });
}

export function useGetSessionEscalationSummary(sessionId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['escalationSummary', sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) throw new Error('Actor or sessionId not available');
      return actor.getSessionEscalationSummary(sessionId);
    },
    enabled: !!actor && !actorFetching && !!sessionId,
  });
}

export function useListUserSessions() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<TroubleshootingSession[]>({
    queryKey: ['userSessions'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const principal = identity.getPrincipal();
      return actor.listUserSessions(principal);
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}
