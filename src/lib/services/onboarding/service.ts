import { getLeadActivities, createLeadActivity } from "@/lib/leads/repository";
import { OnboardingChecklistService, type OnboardingChecklist } from "./checklist";
import { OnboardingProgressService } from "./progress";
import { OnboardingActivityService } from "./activity";
import { WelcomeCommunicationService } from "./communication";
import { CommunicationOrchestrator } from "@/lib/services/communication/orchestrator";

export class OnboardingService {
  private communication: WelcomeCommunicationService;

  constructor(communication: WelcomeCommunicationService = new WelcomeCommunicationService()) {
    this.communication = communication;
  }

  /**
   * Initializes onboarding states for a new workspace.
   */
  async initializeWorkspaceOnboarding(
    leadId: string,
    accountId: string,
    ownerEmail: string,
    ownerName: string,
    loginUrl: string,
    trialEndsAt: string,
    operatorId: string
  ): Promise<OnboardingChecklist> {
    // 1. Log initialization activities to timeline
    await OnboardingActivityService.logOnboardingStep(
      leadId,
      "Workspace Created",
      "Tenant database schema bootstrap complete.",
      operatorId
    );

    await OnboardingActivityService.logOnboardingStep(
      leadId,
      "Owner Invited",
      `Credentials registered for ${ownerEmail}. Welcome email queued.`,
      operatorId
    );

    // 2. Trigger welcome communications
    await this.communication.triggerWelcomeEmail({
      email: ownerEmail,
      fullName: ownerName,
      loginUrl,
      trialEndsAt,
    });

    // 3. Fetch starting checklist state
    return await OnboardingChecklistService.getChecklistState(accountId, ownerIdFromEmail(ownerEmail));
  }

  /**
   * Automatically detects completed steps, logs newly reached milestones to the timeline, and returns the checklist state.
   */
  async evaluateAndLogMilestones(
    leadId: string,
    accountId: string,
    ownerUserId: string,
    operatorId: string
  ): Promise<{
    checklist: OnboardingChecklist;
    progressPercentage: number;
    completed: boolean;
  }> {
    // A. Fetch current database checklist state
    const checklist = await OnboardingChecklistService.getChecklistState(accountId, ownerUserId);
    const progressPercentage = OnboardingProgressService.calculateCompletionPercentage(checklist);
    const completed = OnboardingProgressService.isComplete(checklist);

    // B. Fetch existing timeline activities (bypass if leadId is dummy or missing)
    const isValidLead = leadId && leadId !== "00000000-0000-0000-0000-000000000000";
    const existingActivities = isValidLead ? await getLeadActivities(leadId) : [];
    const loggedSteps = new Set<string>();

    for (const act of existingActivities) {
      if (act.activity_type === "note_added" && act.metadata?.system_event === "onboarding_step_completed") {
        loggedSteps.add(String(act.metadata.step_name));
      }
    }

    // Helper function to log steps if not already logged
    const logIfNew = async (stepName: string, notes: string) => {
      if (isValidLead) {
        if (!loggedSteps.has(stepName)) {
          await createLeadActivity(
            leadId,
            "note_added",
            `Onboarding Milestone: ${stepName} completed.`,
            {
              system_event: "onboarding_step_completed",
              step_name: stepName,
              notes,
            },
            operatorId === "00000000-0000-0000-0000-000000000000" ? undefined : operatorId
          );
        }
      }
    };

    // C. Check and log each milestone
    if (checklist.ownerLoggedIn) {
      await logIfNew("Owner Logged In", "Owner completed credential verification and logged into dashboard.");
    }
    if (checklist.channelsConnected) {
      await logIfNew("WhatsApp Connected", "WhatsApp Business API channel handshake established.");
    }
    if (checklist.teamInvited) {
      await logIfNew("First Team Member", "New teammate invited to the workspace organization.");
    }
    if (checklist.contactsImported) {
      await logIfNew("First Contact Imported", "Contacts directory seeded via imports.");
    }
    if (checklist.firstPipelineCreated) {
      await logIfNew("First Pipeline Created", "Custom deals and pipelines configured.");
    }
    if (checklist.firstAutomationCreated) {
      await logIfNew("First Automation Created", "First automated messaging trigger enabled.");
    }
    if (completed) {
      if (!loggedSteps.has("Onboarding Completed")) {
        await logIfNew("Onboarding Completed", "Workspace onboarding journey successfully finished!");
        if (isValidLead) {
          const orchestrator = new CommunicationOrchestrator();
          await orchestrator.triggerEvent("ONBOARDING_COMPLETED", leadId, {});
        }
      }
    }

    // Persist onboarding status dynamically to database accounts table
    const { supabaseAdmin } = await import("@/lib/flows/admin-client");
    const db = supabaseAdmin();
    await db
      .from("accounts")
      .update({
        onboarding_status: {
          checklist,
          progressPercentage,
          completed,
        },
      })
      .eq("id", accountId);

    return {
      checklist,
      progressPercentage,
      completed,
    };
  }
}

// Internal helper mock
function ownerIdFromEmail(email: string) {
  return "placeholder-owner-id";
}
