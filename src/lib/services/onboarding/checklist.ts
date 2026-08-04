import { supabaseAdmin } from "@/lib/flows/admin-client";

export interface OnboardingChecklist {
  workspaceCreated: boolean;
  ownerInvited: boolean;
  ownerLoggedIn: boolean;
  channelsConnected: boolean;
  teamInvited: boolean;
  contactsImported: boolean;
  firstPipelineCreated: boolean;
  firstAutomationCreated: boolean;
}

export class OnboardingChecklistService {
  /**
   * Loads the current onboarding checklist completion state for a given workspace account.
   * Performs real database queries and aggregations.
   */
  static async getChecklistState(
    accountId: string,
    ownerUserId: string
  ): Promise<OnboardingChecklist> {
    const supabase = supabaseAdmin();

    // 1. Workspace Created (always true if accountId is valid)
    const workspaceCreated = !!accountId;

    // 2. Owner Invited (always true if ownerUserId is valid)
    const ownerInvited = !!ownerUserId;

    // 3. Owner Logged In (check last_sign_in_at in auth.users)
    let ownerLoggedIn = false;
    if (ownerUserId) {
      const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(ownerUserId);
      if (!userErr && userData?.user) {
        ownerLoggedIn = !!userData.user.last_sign_in_at;
      }
    }

    // 4. WhatsApp Connected (check if a row exists in whatsapp_config for this account)
    const { count: configCount } = await supabase
      .from("whatsapp_config")
      .select("id", { count: "exact", head: true })
      .eq("account_id", accountId);
    const channelsConnected = (configCount || 0) > 0;

    // 5. Team Invited (check if profiles count > 1 for this account)
    const { count: profilesCount } = await supabase
      .from("profiles")
      .select("user_id", { count: "exact", head: true })
      .eq("account_id", accountId);
    const teamInvited = (profilesCount || 0) > 1;

    // 6. Contacts Imported (check if contacts count > 0)
    const { count: contactsCount } = await supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("account_id", accountId);
    const contactsImported = (contactsCount || 0) > 0;

    // 7. First Pipeline Created (default is seeded on provision, so custom > 1)
    const { count: pipelinesCount } = await supabase
      .from("pipelines")
      .select("id", { count: "exact", head: true })
      .eq("account_id", accountId);
    const firstPipelineCreated = (pipelinesCount || 0) > 1;

    // 8. First Automation Created (check if automations count > 0)
    const { count: automationsCount } = await supabase
      .from("automations")
      .select("id", { count: "exact", head: true })
      .eq("account_id", accountId);
    const firstAutomationCreated = (automationsCount || 0) > 0;

    return {
      workspaceCreated,
      ownerInvited,
      ownerLoggedIn,
      channelsConnected,
      teamInvited,
      contactsImported,
      firstPipelineCreated,
      firstAutomationCreated,
    };
  }
}
