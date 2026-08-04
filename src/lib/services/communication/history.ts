import { supabaseAdmin } from "@/lib/flows/admin-client";
import type { CommunicationStatus } from "./types";

export class CommunicationHistoryService {
  /**
   * Logs a new pending communication record into the database.
   */
  static async logAttempt(
    recipient: string,
    templateName: string,
    leadId: string | null,
    providerName: string
  ): Promise<string> {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("communication_history")
      .insert({
        recipient,
        template_name: templateName,
        status: "pending" as CommunicationStatus,
        provider: providerName,
        retry_count: 0,
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to log communication attempt: ${error?.message || "No data returned."}`);
    }

    return data.id;
  }

  /**
   * Updates an existing communication log with sending results.
   */
  static async updateResult(
    historyId: string,
    status: CommunicationStatus,
    failureReason: string | null,
    deliveryResult: any | null,
    incrementRetry: boolean = false
  ): Promise<void> {
    const supabase = supabaseAdmin();

    const updatePayload: any = {
      status,
      failure_reason: failureReason,
      delivery_result: deliveryResult,
      updated_at: new Date().toISOString(),
    };

    if (incrementRetry) {
      // Clean increment syntax using raw SQL or loading/updating
      const { data: record } = await supabase
        .from("communication_history")
        .select("retry_count")
        .eq("id", historyId)
        .single();
      if (record) {
        updatePayload.retry_count = (record.retry_count || 0) + 1;
      }
    }

    await supabase
      .from("communication_history")
      .update(updatePayload)
      .eq("id", historyId);
  }
}
