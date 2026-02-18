import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not Principal.equal(caller, user) and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type TroubleshootingStep = {
    description : Text;
    expectedOutcome : Text;
    decisionPoint : ?Text;
  };

  type Runbook = {
    id : Text;
    issueName : Text;
    symptoms : Text;
    steps : [TroubleshootingStep];
  };

  type StepResult = {
    step : TroubleshootingStep;
    outcome : Text;
    timestamp : Time.Time;
  };

  type SessionStatus = {
    #inProgress : {
      currentStep : Nat;
      results : [StepResult];
    };
    #resolved;
    #escalated;
  };

  type TroubleshootingSession = {
    id : Text;
    user : Principal;
    issueDescription : Text;
    runbook : Runbook;
    status : SessionStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module TroubleshootingSession {
    public func compare(a : TroubleshootingSession, b : TroubleshootingSession) : Order.Order {
      switch (a.updatedAt, b.updatedAt) {
        case (a, b) { Int.compare(b, a) };
      };
    };
  };

  let sessions = Map.empty<Text, TroubleshootingSession>();
  let runbooks = Map.empty<Text, Runbook>();

  public shared ({ caller }) func createRunbook(id : Text, issueName : Text, symptoms : Text, steps : [TroubleshootingStep]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create runbooks");
    };
    let runbook : Runbook = {
      id;
      issueName;
      symptoms;
      steps;
    };
    runbooks.add(id, runbook);
  };

  public query ({ caller }) func getRunbook(id : Text) : async Runbook {
    switch (runbooks.get(id)) {
      case (?runbook) { runbook };
      case (null) { Runtime.trap("Runbook not found") };
    };
  };

  public query ({ caller }) func listRunbooks() : async [Runbook] {
    runbooks.values().toArray();
  };

  public shared ({ caller }) func startSession(issueDescription : Text, runbookId : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start sessions");
    };

    let runbook = switch (runbooks.get(runbookId)) {
      case (?rb) { rb };
      case (null) { Runtime.trap("Runbook not found") };
    };

    let id = caller.toText() # "_" # Time.now().toText();

    let session : TroubleshootingSession = {
      id;
      user = caller;
      issueDescription;
      runbook;
      status = #inProgress({
        currentStep = 0;
        results = [];
      });
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    sessions.add(id, session);
    id;
  };

  public shared ({ caller }) func completeStep(sessionId : Text, outcome : Text) : async () {
    let session = switch (sessions.get(sessionId)) {
      case (?s) { s };
      case (null) { Runtime.trap("Session not found") };
    };

    if (not Principal.equal(caller, session.user) and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the session owner or admin can complete steps");
    };

    let steps = session.runbook.steps;
    let currentStep = switch (session.status) {
      case (#inProgress(state)) { state.currentStep };
      case (_) { Runtime.trap("Session is not in progress") };
    };

    if (currentStep >= steps.size()) {
      Runtime.trap("No more steps to complete");
    };

    let stepResult : StepResult = {
      step = steps[currentStep];
      outcome;
      timestamp = Time.now();
    };

    let status = switch (session.status) {
      case (#inProgress(state)) {
        #inProgress({
          currentStep = state.currentStep + 1;
          results = state.results.concat([stepResult]);
        });
      };
      case (_) { session.status };
    };

    let updatedSession : TroubleshootingSession = {
      id = session.id;
      user = session.user;
      issueDescription = session.issueDescription;
      runbook = session.runbook;
      status;
      createdAt = session.createdAt;
      updatedAt = Time.now();
    };

    sessions.add(sessionId, updatedSession);
  };

  public shared ({ caller }) func markResolved(sessionId : Text) : async () {
    markSessionStatus(caller, sessionId, #resolved);
  };

  public shared ({ caller }) func escalate(sessionId : Text) : async () {
    markSessionStatus(caller, sessionId, #escalated);
  };

  func markSessionStatus(caller : Principal, sessionId : Text, newStatus : SessionStatus) {
    let session = switch (sessions.get(sessionId)) {
      case (?s) { s };
      case (null) { Runtime.trap("Session not found") };
    };

    if (not Principal.equal(caller, session.user) and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the session owner or admin can update session status");
    };

    let updatedSession : TroubleshootingSession = {
      id = session.id;
      user = session.user;
      issueDescription = session.issueDescription;
      runbook = session.runbook;
      status = newStatus;
      createdAt = session.createdAt;
      updatedAt = Time.now();
    };

    sessions.add(sessionId, updatedSession);
  };

  public query ({ caller }) func getSession(sessionId : Text) : async TroubleshootingSession {
    let session = switch (sessions.get(sessionId)) {
      case (?s) { s };
      case (null) { Runtime.trap("Session not found") };
    };

    if (not Principal.equal(caller, session.user) and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the session owner or admin can view this session");
    };

    session;
  };

  public query ({ caller }) func listUserSessions(user : Principal) : async [TroubleshootingSession] {
    if (not Principal.equal(caller, user) and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: You do not have permission to view this user's sessions");
    };

    sessions.values().toArray().filter(func(s) { Principal.equal(s.user, user) }).sort();
  };

  public query ({ caller }) func searchSessionsByStatus(status : SessionStatus) : async [TroubleshootingSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search sessions");
    };

    sessions.values().toArray().filter(
      func(s) {
        Principal.equal(s.user, caller) and s.status == status;
      }
    ).sort();
  };

  public query ({ caller }) func getSessionEscalationSummary(sessionId : Text) : async Text {
    let session = switch (sessions.get(sessionId)) {
      case (?s) { s };
      case (null) { Runtime.trap("Session not found") };
    };

    if (not Principal.equal(caller, session.user) and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the session owner or admin can view escalation summary");
    };

    let steps = switch (session.status) {
      case (#inProgress(state)) { state.results };
      case (_) { [] };
    };

    let stepsSummary = steps.foldLeft("", func(acc, stepResult) { acc # "- " # stepResult.step.description # ": " # stepResult.outcome # "\n" });
    let summary = "Symptoms: " # session.issueDescription # "\n\n" # "Steps Attempted:\n" # stepsSummary;
    summary;
  };
};
