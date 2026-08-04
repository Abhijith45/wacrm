import { supabaseAdmin } from "@/lib/flows/admin-client";
import { getPlatformLeadById, createLeadActivity } from "@/lib/leads/repository";
import { CommunicationOrchestrator } from "@/lib/services/communication/orchestrator";

export class WorkspaceProvisioningService {
  /**
   * Helper to generate a clean, globally unique URL slug for the workspace.
   */
  static async generateUniqueSlug(companyName: string): Promise<string> {
    const baseSlug = companyName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, "");    // Trim leading/trailing hyphens

    const finalBase = baseSlug || "workspace";

    const supabase = supabaseAdmin();
    let uniqueSlug = finalBase;
    let counter = 0;

    while (true) {
      const { data, error } = await supabase
        .from("accounts")
        .select("id")
        .eq("slug", uniqueSlug)
        .maybeSingle();

      if (!data && !error) {
        break; // Slug is unique!
      }

      counter++;
      uniqueSlug = `${finalBase}-${counter}`;
    }

    return uniqueSlug;
  }

  /**
   * Helper to generate a strong random temporary password for the owner auth user.
   */
  private static generatePassword(): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Coordinates the entire Workspace Provisioning & Initialization transaction.
   * If any step fails, it executes an automatic rollback of the Auth user (cascading profiles/accounts).
   */
  static async provisionWorkspace(
    leadId: string,
    customerId: string,
    operatorId: string
  ): Promise<{ accountId: string; ownerId: string }> {
    const supabase = supabaseAdmin();

    // 1. Fetch Lead Details
    const lead = await getPlatformLeadById(leadId);
    if (!lead) {
      throw new Error("Lead details not found.");
    }

    // 2. Generate Unique URL Slug
    const uniqueSlug = await this.generateUniqueSlug(lead.company_name);

    let createdUserId: string | null = null;
    let accountId: string | null = null;

    try {
      // 3. Create the Owner User in Supabase Auth via Admin API
      const randomPassword = this.generatePassword();
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: lead.email,
        password: randomPassword,
        email_confirm: true,
        user_metadata: {
          full_name: lead.name,
        },
      });

      if (authError || !authData.user) {
        throw new Error(`Auth owner user creation failed: ${authError?.message || "Unknown error"}`);
      }

      createdUserId = authData.user.id;

      // 4. Locate the bootstrapped profile and account (created by handle_new_user trigger)
      let profile = null;
      let attempts = 0;
      
      // Wait briefly for trigger propagation if necessary (up to 3 retries)
      while (attempts < 3) {
        const { data, error } = await supabase
          .from("profiles")
          .select("account_id")
          .eq("user_id", createdUserId)
          .maybeSingle();

        if (data && data.account_id) {
          profile = data;
          break;
        }
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (!profile || !profile.account_id) {
        throw new Error("Trigger failed to bootstrap user profile/account records.");
      }

      accountId = profile.account_id;

      // 5. Update Account details (slug, customer link, trial parameters)
      const trialStart = new Date();
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial duration

      const { error: accountUpdateError } = await supabase
        .from("accounts")
        .update({
          name: lead.company_name,
          slug: uniqueSlug,
          customer_id: customerId,
          status: "active",
          trial_started_at: trialStart.toISOString(),
          trial_ends_at: trialEnd.toISOString(),
          daily_broadcast_limit: 50,
        })
        .eq("id", accountId);

      if (accountUpdateError) {
        throw new Error(`Failed to update workspace account fields: ${accountUpdateError.message}`);
      }

      // 6. Seed Default Pipeline and Lead stages
      const { data: pipeline, error: pipelineError } = await supabase
        .from("pipelines")
        .insert({
          name: "Sales Pipeline",
          account_id: accountId,
          user_id: createdUserId,
        })
        .select()
        .single();

      if (pipelineError || !pipeline) {
        throw new Error(`Failed to seed default pipeline: ${pipelineError?.message || "Unknown error"}`);
      }

      const defaultStages = [
        { name: "New Lead", color: "#3b82f6", position: 0 },
        { name: "Qualified", color: "#eab308", position: 1 },
        { name: "Proposal Sent", color: "#f97316", position: 2 },
        { name: "Negotiation", color: "#8b5cf6", position: 3 },
        { name: "Won", color: "#22c55e", position: 4 },
      ];

      const stagesPayload = defaultStages.map((s) => ({
        pipeline_id: pipeline.id,
        name: s.name,
        color: s.color,
        position: s.position,
      }));

      const { error: stagesError } = await supabase
        .from("pipeline_stages")
        .insert(stagesPayload);

      if (stagesError) {
        throw new Error(`Failed to seed default pipeline stages: ${stagesError.message}`);
      }

      // 7. Seed Default System Tags
      const defaultTags = [
        { name: "new_contact", color: "#3b82f6" },
        { name: "vip", color: "#eab308" },
        { name: "supporter", color: "#22c55e" },
      ];

      const tagsPayload = defaultTags.map((t) => ({
        name: t.name,
        color: t.color,
        account_id: accountId,
      }));

      const { error: tagsError } = await supabase
        .from("tags")
        .insert(tagsPayload);

      if (tagsError) {
        throw new Error(`Failed to seed default workspace tags: ${tagsError.message}`);
      }

      // 8. Associate workspace link back to the platform lead record
      const { error: leadUpdateError } = await supabase
        .from("platform_leads")
        .update({
          workspace_id: accountId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", leadId);

      if (leadUpdateError) {
        throw new Error(`Failed to associate workspace to platform lead: ${leadUpdateError.message}`);
      }

      // 9. Write timeline activities to the Activity Center
      await createLeadActivity(
        leadId,
        "workspace_provisioned",
        `Workspace directory successfully provisioned for "${lead.company_name}" with sub-routing slug "/${uniqueSlug}".`,
        {
          workspace_id: accountId,
          workspace_name: lead.company_name,
          slug: uniqueSlug,
        },
        operatorId
      );

      await createLeadActivity(
        leadId,
        "workspace_created",
        `Workspace Owner invitation initialized for ${lead.email}. Credentials registered.`,
        {
          owner_id: createdUserId,
          owner_email: lead.email,
        },
        operatorId
      );

      await createLeadActivity(
        leadId,
        "note_added",
        `14-day free trial initialized. Expiration date set to ${trialEnd.toLocaleDateString()}. Daily broadcast limit configured to 50 messages.`,
        {
          trial_starts_at: trialStart.toISOString(),
          trial_ends_at: trialEnd.toISOString(),
          daily_broadcast_limit: 50,
        },
        operatorId
      );

      // 10. Trigger Automated Communication Lifecycle Events (Sprint 3.6)
      const orchestrator = new CommunicationOrchestrator();
      const workspaceUrl = `https://syncwa.com/w/${uniqueSlug}`;

      await orchestrator.triggerEvent("CUSTOMER_CONVERTED", leadId, {
        customerName: lead.name,
        companyName: lead.company_name,
      });

      await orchestrator.triggerEvent("OWNER_INVITED", leadId, {
        customerName: lead.name,
        ownerEmail: lead.email,
        workspaceUrl,
      });

      await orchestrator.triggerEvent("TRIAL_STARTED", leadId, {
        customerName: lead.name,
        trialEndsAt: trialEnd.toISOString(),
        loginUrl: `${workspaceUrl}/login`,
      });

      return {
        accountId: accountId!,
        ownerId: createdUserId!,
      };
    } catch (error) {
      console.error("[WorkspaceProvisioningService] Execution failed. Triggering rollback:", error);
      
      // ROLLBACK: Clean up the created Auth user which automatically cascades and deletes the linked profile/account records.
      if (createdUserId) {
        try {
          await supabase.auth.admin.deleteUser(createdUserId);
          console.log(`[WorkspaceProvisioningService] Rollback: Auth user ${createdUserId} successfully deleted.`);
        } catch (rollbackErr) {
          console.error(`[WorkspaceProvisioningService] Rollback failed for user ${createdUserId}:`, rollbackErr);
        }
      }

      throw error;
    }
  }
}
