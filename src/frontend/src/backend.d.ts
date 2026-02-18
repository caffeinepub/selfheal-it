import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface TroubleshootingSession {
    id: string;
    status: SessionStatus;
    issueDescription: string;
    createdAt: Time;
    user: Principal;
    updatedAt: Time;
    runbook: Runbook;
}
export type SessionStatus = {
    __kind__: "resolved";
    resolved: null;
} | {
    __kind__: "escalated";
    escalated: null;
} | {
    __kind__: "inProgress";
    inProgress: {
        results: Array<StepResult>;
        currentStep: bigint;
    };
};
export interface StepResult {
    step: TroubleshootingStep;
    timestamp: Time;
    outcome: string;
}
export interface TroubleshootingStep {
    description: string;
    decisionPoint?: string;
    expectedOutcome: string;
}
export interface UserProfile {
    name: string;
}
export interface Runbook {
    id: string;
    issueName: string;
    steps: Array<TroubleshootingStep>;
    symptoms: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeStep(sessionId: string, outcome: string): Promise<void>;
    createRunbook(id: string, issueName: string, symptoms: string, steps: Array<TroubleshootingStep>): Promise<void>;
    escalate(sessionId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRunbook(id: string): Promise<Runbook>;
    getSession(sessionId: string): Promise<TroubleshootingSession>;
    getSessionEscalationSummary(sessionId: string): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listRunbooks(): Promise<Array<Runbook>>;
    listUserSessions(user: Principal): Promise<Array<TroubleshootingSession>>;
    markResolved(sessionId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchSessionsByStatus(status: SessionStatus): Promise<Array<TroubleshootingSession>>;
    startSession(issueDescription: string, runbookId: string): Promise<string>;
}
