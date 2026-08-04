import { supabaseAdmin } from "@/lib/flows/admin-client";
import { getPlatformLeadById, createLeadActivity } from "@/lib/leads/repository";
import { CommunicationOrchestrator } from "@/lib/services/communication/orchestrator";
import type { PlatformCustomerStatus } from "@/types";

export class CommercialService {
  /**
   * Validates state transitions in the Commercial State Machine (locked PRD section 25.1).
   */
  static isValidTransition(oldStatus: PlatformCustomerStatus, newStatus: PlatformCustomerStatus): boolean {
    if (oldStatus === newStatus) return true;

    // Transition rules dictionary
    const transitions: Record<PlatformCustomerStatus, PlatformCustomerStatus[]> = {
      prospect: ["trial", "cancelled"],
      trial: ["trial_expiring", "active", "suspended", "cancelled"],
      trial_expiring: ["trial", "active", "suspended", "cancelled"],
      active: ["suspended", "cancelled"],
      suspended: ["active", "trial", "trial_expiring", "cancelled"],
      cancelled: ["archived"],
      archived: [], // Terminal state
    };

    const allowed = transitions[oldStatus] || [];
    return allowed.includes(newStatus);
  }

  /**
   * Manual Trial Extension. Updates trial_ends_at on account, increments counts, and records logs.
   */
  static async extendTrial(
    customerId: string,
    leadId: string,
    extensionDays: number,
    reason: string,
    operatorId: string
  ): Promise<any> {
    const supabase = supabaseAdmin();

    // 1. Load active Customer details
    const { data: customer, error: customerErr } = await supabase
      .from("platform_customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (customerErr || !customer) {
      throw new Error("Customer profile not found.");
    }

    if (customer.status !== "trial" && customer.status !== "trial_expiring" && customer.status !== "suspended") {
      throw new Error(`Cannot extend trial for customer in "${customer.status}" status.`);
    }

    // 2. Fetch linked workspace account
    const lead = await getPlatformLeadById(leadId);
    if (!lead || !lead.workspace_id) {
      throw new Error("Lead has no provisioned workspace linked.");
    }

    const { data: account, error: accountErr } = await supabase
      .from("accounts")
      .select("trial_ends_at")
      .eq("id", lead.workspace_id)
      .single();

    if (accountErr || !account) {
      throw new Error("Workspace account details not found.");
    }

    // Calculate new expiration date
    const currentExpiry = account.trial_ends_at ? new Date(account.trial_ends_at) : new Date();
    const newExpiry = new Date(currentExpiry.getTime());
    newExpiry.setDate(newExpiry.getDate() + extensionDays);

    // 3. Update database details in a transaction-like sequence
    const { error: accUpdateErr } = await supabase
      .from("accounts")
      .update({
        trial_ends_at: newExpiry.toISOString(),
        status: "active", // Reactivates workspace if it was suspended
      })
      .eq("id", lead.workspace_id);

    if (accUpdateErr) {
      throw new Error(`Failed to update trial expiry date: ${accUpdateErr.message}`);
    }

    const nextExtensionCount = (customer.trial_extension_count || 0) + 1;
    let nextStatus: PlatformCustomerStatus = "trial";
    // Check if new expiry is less than 3 days in the future
    const diffTime = newExpiry.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 3 && diffDays > 0) {
      nextStatus = "trial_expiring";
    }

    const { data: updatedCustomer, error: custUpdateErr } = await supabase
      .from("platform_customers")
      .update({
        trial_extension_count: nextExtensionCount,
        status: nextStatus,
        suspended_reason: null, // Clear suspension details if applicable
      })
      .eq("id", customerId)
      .select()
      .single();

    if (custUpdateErr) {
      throw new Error(`Failed to update customer extension attributes: ${custUpdateErr.message}`);
    }

    // 4. Log timeline activity
    await createLeadActivity(
      leadId,
      "trial_extended",
      `Trial extended by ${extensionDays} days. New expiration: ${newExpiry.toLocaleDateString()}. Reason: "${reason}"`,
      {
        extension_days: extensionDays,
        new_expiry_date: newExpiry.toISOString(),
        previous_expiry_date: account.trial_ends_at,
        extension_count: nextExtensionCount,
        reason,
      },
      operatorId
    );

    return updatedCustomer;
  }

  /**
   * Suspends a Customer and sets the associated workspace accounts to suspended state.
   */
  static async suspendWorkspace(
    customerId: string,
    leadId: string,
    reason: string,
    operatorId: string
  ): Promise<any> {
    const supabase = supabaseAdmin();

    const { data: customer, error: customerErr } = await supabase
      .from("platform_customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (customerErr || !customer) {
      throw new Error("Customer profile not found.");
    }

    // 1. Enforce transition state rules
    if (!this.isValidTransition(customer.status, "suspended")) {
      throw new Error(`Invalid transition: Cannot suspend customer in "${customer.status}" status.`);
    }

    // 2. Fetch workspace link
    const lead = await getPlatformLeadById(leadId);
    if (!lead || !lead.workspace_id) {
      throw new Error("Lead has no provisioned workspace linked.");
    }

    // 3. Update Customer & Account statuses
    const { error: accUpdateErr } = await supabase
      .from("accounts")
      .update({ status: "suspended" })
      .eq("id", lead.workspace_id);

    if (accUpdateErr) {
      throw new Error(`Failed to suspend workspace account: ${accUpdateErr.message}`);
    }

    const { data: updatedCustomer, error: custUpdateErr } = await supabase
      .from("platform_customers")
      .update({
        status: "suspended",
        suspended_reason: reason,
      })
      .eq("id", customerId)
      .select()
      .single();

    if (custUpdateErr) {
      throw new Error(`Failed to suspend customer: ${custUpdateErr.message}`);
    }

    // 4. Log timeline activities
    await createLeadActivity(
      leadId,
      "workspace_suspended",
      `Workspace access suspended. Reason: "${reason}"`,
      {
        previous_status: customer.status,
        reason,
      },
      operatorId
    );

    // 5. Trigger Automated Communication Event (Sprint 3.6)
    const orchestrator = new CommunicationOrchestrator();
    await orchestrator.triggerEvent("TRIAL_EXPIRED", leadId, {
      customerName: customer.company_name,
    });

    return updatedCustomer;
  }

  /**
   * Resumes a suspended Customer workspace.
   */
  static async resumeWorkspace(
    customerId: string,
    leadId: string,
    operatorId: string
  ): Promise<any> {
    const supabase = supabaseAdmin();

    const { data: customer, error: customerErr } = await supabase
      .from("platform_customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (customerErr || !customer) {
      throw new Error("Customer profile not found.");
    }

    if (customer.status !== "suspended") {
      throw new Error("Only suspended customer workspaces can be resumed.");
    }

    // 1. Fetch workspace details to determine if trial is still valid
    const lead = await getPlatformLeadById(leadId);
    if (!lead || !lead.workspace_id) {
      throw new Error("Lead has no provisioned workspace linked.");
    }

    const { data: account, error: accountErr } = await supabase
      .from("accounts")
      .select("trial_ends_at")
      .eq("id", lead.workspace_id)
      .single();

    if (accountErr || !account) {
      throw new Error("Workspace account details not found.");
    }

    // Check expiration boundaries to decide restored status
    let restoredStatus: PlatformCustomerStatus = "trial";
    const expiry = account.trial_ends_at ? new Date(account.trial_ends_at) : new Date(0);
    const now = new Date();
    
    if (expiry.getTime() <= now.getTime()) {
      throw new Error("Cannot resume workspace because the trial period has expired. Please extend the trial first.");
    }

    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) {
      restoredStatus = "trial_expiring";
    }

    // 2. Reactivate customer and workspace account records
    const { error: accUpdateErr } = await supabase
      .from("accounts")
      .update({ status: "active" })
      .eq("id", lead.workspace_id);

    if (accUpdateErr) {
      throw new Error(`Failed to activate workspace account: ${accUpdateErr.message}`);
    }

    const { data: updatedCustomer, error: custUpdateErr } = await supabase
      .from("platform_customers")
      .update({
        status: restoredStatus,
        suspended_reason: null,
      })
      .eq("id", customerId)
      .select()
      .single();

    if (custUpdateErr) {
      throw new Error(`Failed to update customer resume details: ${custUpdateErr.message}`);
    }

    // 3. Log timeline activity
    await createLeadActivity(
      leadId,
      "workspace_reactivated",
      `Workspace resumed successfully. Plan restored to ${restoredStatus}.`,
      {
        restored_status: restoredStatus,
      },
      operatorId
    );

    return updatedCustomer;
  }

  /**
   * Manually modifies customer status, enforcing state transition validity checks.
   */
  static async updateCommercialStatus(
    customerId: string,
    leadId: string,
    newStatus: PlatformCustomerStatus,
    operatorId: string
  ): Promise<any> {
    const supabase = supabaseAdmin();

    const { data: customer, error: customerErr } = await supabase
      .from("platform_customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (customerErr || !customer) {
      throw new Error("Customer profile not found.");
    }

    // 1. Enforce transition validations
    if (!this.isValidTransition(customer.status, newStatus)) {
      throw new Error(`Invalid transition: Cannot update status from "${customer.status}" to "${newStatus}".`);
    }

    // 2. Resolve workspace ID link
    const lead = await getPlatformLeadById(leadId);
    if (!lead || !lead.workspace_id) {
      throw new Error("Lead has no provisioned workspace linked.");
    }

    // Determine target account status mapping
    let accStatus = "active";
    let cancelledAt = customer.cancelled_at;
    let archivedAt = customer.archived_at;

    if (newStatus === "suspended") {
      accStatus = "suspended";
    } else if (newStatus === "cancelled") {
      accStatus = "suspended";
      cancelledAt = new Date().toISOString();
    } else if (newStatus === "archived") {
      accStatus = "archived";
      archivedAt = new Date().toISOString();
    }

    // 3. Update customer and workspace account records
    const { error: accUpdateErr } = await supabase
      .from("accounts")
      .update({ status: accStatus })
      .eq("id", lead.workspace_id);

    if (accUpdateErr) {
      throw new Error(`Failed to update workspace account status: ${accUpdateErr.message}`);
    }

    const { data: updatedCustomer, error: custUpdateErr } = await supabase
      .from("platform_customers")
      .update({
        status: newStatus,
        cancelled_at: cancelledAt,
        archived_at: archivedAt,
        suspended_reason: newStatus !== "suspended" ? null : customer.suspended_reason,
      })
      .eq("id", customerId)
      .select()
      .single();

    if (custUpdateErr) {
      throw new Error(`Failed to update customer status: ${custUpdateErr.message}`);
    }

    // 4. Log timeline activity
    await createLeadActivity(
      leadId,
      "commercial_status_changed",
      `Commercial status updated from "${customer.status}" to "${newStatus}".`,
      {
        old_status: customer.status,
        new_status: newStatus,
      },
      operatorId
    );

    return updatedCustomer;
  }
}
