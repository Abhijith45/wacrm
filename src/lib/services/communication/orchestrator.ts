import { getPlatformLeadById, createLeadActivity } from "@/lib/leads/repository";
import { CommunicationTemplateService } from "./templates";
import { MockEmailProvider } from "./provider";
import { CommunicationHistoryService } from "./history";
import type { CommunicationEvent, EmailProviderInterface } from "./types";

export class CommunicationOrchestrator {
  private emailProvider: EmailProviderInterface;

  constructor(emailProvider: EmailProviderInterface = new MockEmailProvider()) {
    this.emailProvider = emailProvider;
  }

  /**
   * Orchestrates the delivery of a lifecycle communication event.
   */
  async triggerEvent(
    event: CommunicationEvent,
    leadId: string,
    variables: any
  ): Promise<boolean> {
    try {
      // 1. Resolve Lead Details
      const lead = await getPlatformLeadById(leadId);
      if (!lead || !lead.email) {
        console.warn(`[CommunicationOrchestrator] Skipped event "${event}": Lead has no valid email.`);
        return false;
      }

      // Map event keys to template names
      const templateMap: Record<CommunicationEvent, string> = {
        CUSTOMER_CONVERTED: "welcome",
        WORKSPACE_PROVISIONED: "workspace_ready",
        OWNER_INVITED: "workspace_ready", // Handled inside conversion ready triggers
        TRIAL_STARTED: "trial_started",
        ONBOARDING_REMINDER: "onboarding_reminder",
        TRIAL_EXPIRING: "trial_expiring",
        TRIAL_EXPIRED: "trial_expired",
        ONBOARDING_COMPLETED: "onboarding_completed",
      };

      const templateName = templateMap[event] || "default";

      // 2. Render Template Content
      const templateVars = {
        customerName: lead.name,
        companyName: lead.company_name,
        ownerEmail: lead.email,
        ...variables,
      };

      const { subject, bodyText, bodyHtml } = CommunicationTemplateService.render(
        templateName,
        templateVars
      );

      // 3. Log Initial Attempt (Pending status)
      const historyId = await CommunicationHistoryService.logAttempt(
        lead.email,
        templateName,
        leadId,
        "MockEmailProvider"
      );

      // 4. Send Email using configured provider
      const dispatchResult = await this.emailProvider.sendEmail({
        to: lead.email,
        subject,
        bodyText,
        bodyHtml,
      });

      // 5. Update history logs and write timeline milestone activities
      if (dispatchResult.success) {
        await CommunicationHistoryService.updateResult(
          historyId,
          "sent",
          null,
          dispatchResult.rawResponse
        );

        // Append log to unified activity timeline
        await createLeadActivity(
          leadId,
          "email_sent",
          `Lifecycle Communication Dispatched: "${subject}" (Template: ${templateName})`,
          {
            event_name: event,
            template_name: templateName,
            subject,
            history_id: historyId,
          },
          "00000000-0000-0000-0000-000000000000" // System operator identifier
        );
        return true;
      } else {
        const errStr = dispatchResult.error || "Unknown provider exception.";
        await CommunicationHistoryService.updateResult(
          historyId,
          "failed",
          errStr,
          dispatchResult.rawResponse
        );

        // Log failure to timeline
        await createLeadActivity(
          leadId,
          "note_added",
          `Lifecycle Communication FAILED: "${subject}". Error: ${errStr}`,
          {
            event_name: event,
            template_name: templateName,
            error: errStr,
            history_id: historyId,
            system_event: "communication_failed",
          },
          "00000000-0000-0000-0000-000000000000"
        );
        return false;
      }
    } catch (error) {
      console.error(`[CommunicationOrchestrator] Failed executing event "${event}":`, error);
      return false;
    }
  }
}
