import { supabaseAdmin } from "@/lib/flows/admin-client";
import { createLeadActivity } from "@/lib/leads/repository";
import { MockEmailProvider } from "./provider";
import { CommunicationHistoryService } from "./history";
import { CommunicationTemplateService } from "./templates";
import type { EmailProviderInterface, CommunicationStatus } from "./types";

export class CommunicationService {
  private emailProvider: EmailProviderInterface;

  constructor(emailProvider: EmailProviderInterface = new MockEmailProvider()) {
    this.emailProvider = emailProvider;
  }

  /**
   * Executes a manual retry on a failed communication log.
   */
  async manualRetry(historyId: string, operatorId: string): Promise<any> {
    const supabase = supabaseAdmin();

    // 1. Fetch historical record details
    const { data: record, error: recordErr } = await supabase
      .from("communication_history")
      .select("*")
      .eq("id", historyId)
      .single();

    if (recordErr || !record) {
      throw new Error("Communication history record not found.");
    }

    // 2. Validate retry thresholds (limits to 3 max attempts)
    if (record.retry_count >= 3) {
      throw new Error("Maximum retry limit (3) exceeded for this communication.");
    }

    // 3. Render template using variables from lead context
    const { data: lead } = await supabase
      .from("platform_leads")
      .select("name, company_name, email")
      .eq("id", record.lead_id)
      .single();

    const recipient = record.recipient;
    const templateName = record.template_name;

    const { subject, bodyText, bodyHtml } = CommunicationTemplateService.render(
      templateName,
      {
        customerName: lead?.name || "Customer",
        companyName: lead?.company_name || "Company",
        ownerEmail: recipient,
        ...record.delivery_result?.variables,
      }
    );

    // 4. Update status to pending before starting execution
    await CommunicationHistoryService.updateResult(historyId, "pending", null, null, true);

    // 5. Run provider send email
    const dispatchResult = await this.emailProvider.sendEmail({
      to: recipient,
      subject,
      bodyText,
      bodyHtml,
    });

    const nextRetryCount = (record.retry_count || 0) + 1;

    // 6. Update results and record timeline history events
    if (dispatchResult.success) {
      await CommunicationHistoryService.updateResult(
        historyId,
        "sent",
        null,
        dispatchResult.rawResponse
      );

      if (record.lead_id) {
        await createLeadActivity(
          record.lead_id,
          "email_sent",
          `Manual Retry Succeeded: "${subject}" (Attempt #${nextRetryCount})`,
          {
            template_name: templateName,
            subject,
            history_id: historyId,
            retry_attempt: nextRetryCount,
          },
          operatorId
        );
      }
    } else {
      const errStr = dispatchResult.error || "Manual retry provider execution failed.";
      await CommunicationHistoryService.updateResult(
        historyId,
        "failed",
        errStr,
        dispatchResult.rawResponse
      );

      if (record.lead_id) {
        await createLeadActivity(
          record.lead_id,
          "note_added",
          `Manual Retry FAILED: "${subject}" (Attempt #${nextRetryCount}). Error: ${errStr}`,
          {
            template_name: templateName,
            error: errStr,
            history_id: historyId,
            retry_attempt: nextRetryCount,
            system_event: "communication_failed",
          },
          operatorId
        );
      }
      throw new Error(errStr);
    }

    // Return the updated communication record
    const { data: updatedRecord } = await supabase
      .from("communication_history")
      .select("*")
      .eq("id", historyId)
      .single();

    return updatedRecord;
  }
}
