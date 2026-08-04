import { supabaseAdmin } from "@/lib/flows/admin-client";
import type { PlatformLead } from "@/types";

export interface CreateLeadInput {
  name: string;
  company_name: string;
  email: string;
  phone?: string;
  country?: string;
  company_size?: string;
  message: string;
  subject?: string;
  interest_area?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer_url?: string;
}

/**
 * Checks if a lead with matching email, phone, or company name + full name already exists.
 * Returns the matching lead row if found, otherwise null.
 */
export async function findDuplicateLead(input: {
  email: string;
  phone?: string;
  companyName: string;
  name: string;
}): Promise<PlatformLead | null> {
  const supabase = supabaseAdmin();

  // 1. Check by email
  const { data: emailMatch, error: emailErr } = await supabase
    .from("platform_leads")
    .select("*")
    .eq("email", input.email.trim())
    .maybeSingle();

  if (!emailErr && emailMatch) {
    return emailMatch as PlatformLead;
  }

  // 2. Check by phone if provided
  if (input.phone?.trim()) {
    const { data: phoneMatch, error: phoneErr } = await supabase
      .from("platform_leads")
      .select("*")
      .eq("phone", input.phone.trim())
      .maybeSingle();

    if (!phoneErr && phoneMatch) {
      return phoneMatch as PlatformLead;
    }
  }

  // 3. Check by company_name + name combination
  const { data: comboMatch, error: comboErr } = await supabase
    .from("platform_leads")
    .select("*")
    .eq("company_name", input.companyName.trim())
    .eq("name", input.name.trim())
    .maybeSingle();

  if (!comboErr && comboMatch) {
    return comboMatch as PlatformLead;
  }

  return null;
}

/**
 * Inserts a new platform lead record into the database.
 */
export async function createPlatformLead(input: CreateLeadInput): Promise<PlatformLead> {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("platform_leads")
    .insert({
      name: input.name.trim(),
      company_name: input.company_name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || null,
      country: input.country?.trim() || null,
      company_size: input.company_size?.trim() || null,
      message: input.message.trim(),
      subject: input.subject?.trim() || null,
      interest_area: input.interest_area?.trim() || null,
      source: input.source || "contact_form",
      utm_source: input.utm_source || null,
      utm_medium: input.utm_medium || null,
      utm_campaign: input.utm_campaign || null,
      utm_content: input.utm_content || null,
      utm_term: input.utm_term || null,
      referrer_url: input.referrer_url || null,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[createPlatformLead] Insertion error:", error);
    throw new Error(`Lead persistence failed: ${error.message}`);
  }

  return data as PlatformLead;
}

export interface GetLeadsOptions {
  q?: string;
  status?: string;
  source?: string;
  sortBy?: "newest" | "oldest" | "name" | "company" | "status";
  page?: number;
  pageSize?: number;
}

export interface GetLeadsResult {
  leads: PlatformLead[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetch platform leads matching search, status, and source filters.
 * Returns paginated, sorted results and total row counts.
 */
export async function getPlatformLeads(options: GetLeadsOptions): Promise<GetLeadsResult> {
  const supabase = supabaseAdmin();
  const page = options.page && options.page > 0 ? options.page : 1;
  const pageSize = options.pageSize && options.pageSize > 0 ? options.pageSize : 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("platform_leads")
    .select("*", { count: "exact" });

  // 1. Search Query Parameter filter (Multi-column ILIKE matching)
  if (options.q?.trim()) {
    const term = `%${options.q.trim()}%`;
    query = query.or(`name.ilike.${term},company_name.ilike.${term},email.ilike.${term},phone.ilike.${term}`);
  }

  // 2. Status Lifecycle filter
  if (options.status?.trim()) {
    query = query.eq("status", options.status.trim());
  }

  // 3. Marketing Source filter
  if (options.source?.trim()) {
    query = query.eq("source", options.source.trim());
  }

  // 4. Server-side Sorting
  const sortBy = options.sortBy || "newest";
  if (sortBy === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sortBy === "name") {
    query = query.order("name", { ascending: true });
  } else if (sortBy === "company") {
    query = query.order("company_name", { ascending: true });
  } else if (sortBy === "status") {
    query = query.order("status", { ascending: true });
  }

  // 5. Paginated execution range
  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("[getPlatformLeads] fetch error:", error);
    throw new Error(`Failed to load platform leads: ${error.message}`);
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    leads: (data || []) as PlatformLead[],
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

export interface LeadMetrics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
}

/**
 * Fetch consolidated platform leads telemetry counts from database.
 */
export async function getLeadMetrics(): Promise<LeadMetrics> {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("platform_leads")
    .select("status");

  if (error) {
    console.error("[getLeadMetrics] fetch error:", error);
    return { totalLeads: 0, newLeads: 0, qualifiedLeads: 0, convertedLeads: 0 };
  }

  const stats = {
    totalLeads: data.length,
    newLeads: 0,
    qualifiedLeads: 0,
    convertedLeads: 0,
  };

  data.forEach((row) => {
    if (row.status === "new") stats.newLeads++;
    else if (row.status === "qualified") stats.qualifiedLeads++;
    else if (row.status === "converted") stats.convertedLeads++;
  });

  return stats;
}

/**
 * Retrieve a specific platform lead by its UUID.
 * Returns the lead if found, otherwise null.
 */
export async function getPlatformLeadById(id: string): Promise<PlatformLead | null> {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("platform_leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`[getPlatformLeadById] fetch error for ID ${id}:`, error);
    return null;
  }

  return data as PlatformLead | null;
}

export interface HydratedActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  note: string | null;
  metadata: any;
  created_by: string | null;
  created_at: string;
  operatorName: string;
}

/**
 * Fetch chronological activity history for a specific platform lead.
 * Returns operator names joined by separate queries to prevent schema FK cache drops.
 */
export async function getLeadActivities(leadId: string): Promise<HydratedActivity[]> {
  const supabase = supabaseAdmin();
  
  const { data: activities, error } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`[getLeadActivities] error for lead ${leadId}:`, error);
    throw new Error(`Failed to load activities: ${error.message}`);
  }

  if (!activities || activities.length === 0) return [];

  // Extract unique user UUIDs
  const userIds = Array.from(new Set(activities.map(a => a.created_by).filter(Boolean)));
  
  // Load profiles mapping for these users
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name")
    .in("user_id", userIds);

  const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

  return activities.map(a => ({
    ...a,
    operatorName: a.created_by ? (profileMap.get(a.created_by) || "SyncWA Operator") : "System",
  })) as HydratedActivity[];
}

/**
 * Insert a new activity log entry for a platform lead.
 */
export async function createLeadActivity(
  leadId: string,
  activityType: string,
  note?: string,
  metadata: any = {},
  createdBy?: string
): Promise<HydratedActivity> {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("lead_activities")
    .insert({
      lead_id: leadId,
      activity_type: activityType,
      note: note || null,
      metadata: metadata || {},
      created_by: createdBy || null,
    })
    .select("*")
    .single();

  if (error) {
    console.error(`[createLeadActivity] error:`, error);
    throw new Error(`Failed to create lead activity: ${error.message}`);
  }

  // Hydrate the operator name
  let operatorName = "System";
  if (createdBy) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", createdBy)
      .maybeSingle();
    operatorName = profile?.full_name || "SyncWA Operator";
  }

  return {
    ...data,
    operatorName,
  } as HydratedActivity;
}

export interface PlatformStaff {
  userId: string;
  fullName: string;
  email: string;
}

/**
 * Retrieve the list of all assignable admin staff profiles.
 */
export async function getPlatformStaffList(): Promise<PlatformStaff[]> {
  const supabase = supabaseAdmin();
  
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, email")
    .eq("is_platform_staff", true)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[getPlatformStaffList] fetch error:", error);
    return [];
  }

  return (data || []).map(row => ({
    userId: row.user_id,
    fullName: row.full_name || "SyncWA Operator",
    email: row.email || "",
  }));
}

/**
 * Modify a lead's lifecycle status and record a status_changed activity timeline log.
 */
export async function updateLeadStatus(
  leadId: string,
  status: any,
  operatorId: string
): Promise<{ lead: PlatformLead; activity: HydratedActivity }> {
  const supabase = supabaseAdmin();

  // 1. Fetch current status
  const { data: currentLead, error: leadErr } = await supabase
    .from("platform_leads")
    .select("status")
    .eq("id", leadId)
    .single();

  if (leadErr || !currentLead) {
    throw new Error(`Lead lookup failed: ${leadErr?.message || "Record not found"}`);
  }

  const oldStatus = currentLead.status;

  // 2. Perform Update
  const { data: updatedLead, error: updateErr } = await supabase
    .from("platform_leads")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .select("*")
    .single();

  if (updateErr || !updatedLead) {
    throw new Error(`Lead status update failed: ${updateErr?.message}`);
  }

  // 3. Log status_changed timeline activity
  const activity = await createLeadActivity(
    leadId,
    "status_changed",
    `Status updated from "${oldStatus.replace("_", " ")}" to "${status.replace("_", " ")}".`,
    {
      old_status: oldStatus,
      new_status: status,
    },
    operatorId
  );

  return { lead: updatedLead as PlatformLead, activity };
}

/**
 * Modify a lead's assignee operator and record an assigned activity timeline log.
 */
export async function updateLeadAssignment(
  leadId: string,
  assigneeId: string | null,
  operatorId: string
): Promise<{ lead: PlatformLead; activity: HydratedActivity }> {
  const supabase = supabaseAdmin();

  // 1. Fetch current assignee
  const { data: currentLead, error: leadErr } = await supabase
    .from("platform_leads")
    .select("assigned_to")
    .eq("id", leadId)
    .single();

  if (leadErr || !currentLead) {
    throw new Error(`Lead lookup failed: ${leadErr?.message || "Record not found"}`);
  }

  const oldAssigneeId = currentLead.assigned_to;

  // 2. Perform Update
  const { data: updatedLead, error: updateErr } = await supabase
    .from("platform_leads")
    .update({
      assigned_to: assigneeId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .select("*")
    .single();

  if (updateErr || !updatedLead) {
    throw new Error(`Lead assignment update failed: ${updateErr?.message}`);
  }

  // 3. Resolve representative names
  let oldRepName = "Unassigned";
  let newRepName = "Unassigned";

  const userIds = [oldAssigneeId, assigneeId].filter(Boolean) as string[];
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);
    if (oldAssigneeId) oldRepName = profileMap.get(oldAssigneeId) || "SyncWA Operator";
    if (assigneeId) newRepName = profileMap.get(assigneeId) || "SyncWA Operator";
  }

  // 4. Log assigned timeline activity
  const activity = await createLeadActivity(
    leadId,
    "assigned",
    assigneeId 
      ? `Assigned representative set to "${newRepName}".`
      : `Representative assignment removed.`,
    {
      old_assignee: oldRepName,
      new_assignee: newRepName,
    },
    operatorId
  );

  return { lead: updatedLead as PlatformLead, activity };
}

export interface PlatformTag {
  id: string;
  name: string;
  color: string;
}

/**
 * Retrieve all registered reusable platform tags.
 */
export async function getPlatformTags(): Promise<PlatformTag[]> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("platform_tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("[getPlatformTags] error:", error);
    return [];
  }

  return (data || []) as PlatformTag[];
}

/**
 * Retrieve active tags currently mapped to a specific lead.
 */
export async function getLeadTags(leadId: string): Promise<PlatformTag[]> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("platform_lead_tags")
    .select("platform_tags(*)")
    .eq("lead_id", leadId);

  if (error) {
    console.error("[getLeadTags] error:", error);
    return [];
  }

  // Map and filter nulls safely
  return (data || [])
    .map((row: any) => row.platform_tags)
    .filter(Boolean) as PlatformTag[];
}

/**
 * Associate a platform tag to a lead, and log a note_added system event timeline activity.
 */
export async function addLeadTag(
  leadId: string,
  tagName: string,
  operatorId: string
): Promise<{ tag: PlatformTag; activity: HydratedActivity }> {
  const supabase = supabaseAdmin();
  const normalized = tagName.trim().toLowerCase();

  if (!normalized) {
    throw new Error("Tag name cannot be empty");
  }

  // 1. Upsert tag inside platform_tags
  const { data: tag, error: tagErr } = await supabase
    .from("platform_tags")
    .upsert({ name: normalized }, { onConflict: "name" })
    .select("*")
    .single();

  if (tagErr || !tag) {
    throw new Error(`Tag creation failed: ${tagErr?.message}`);
  }

  // 2. Bind to lead
  const { error: bindErr } = await supabase
    .from("platform_lead_tags")
    .insert({
      lead_id: leadId,
      tag_id: tag.id,
    });

  if (bindErr) {
    // If it's already bound, we return successfully
    if (bindErr.code !== "23505") {
      throw new Error(`Failed to associate tag: ${bindErr.message}`);
    }
  }

  // 3. Log timeline activity as a system note
  const activity = await createLeadActivity(
    leadId,
    "note_added",
    `Tag "${tag.name}" attached to lead.`,
    {
      system_event: "tag_added",
      tag_name: tag.name,
    },
    operatorId
  );

  return { tag: tag as PlatformTag, activity };
}

/**
 * Remove a tag mapping from a lead, and log a note_added system event timeline activity.
 */
export async function removeLeadTag(
  leadId: string,
  tagId: string,
  operatorId: string
): Promise<{ tagId: string; activity: HydratedActivity }> {
  const supabase = supabaseAdmin();

  // 1. Fetch tag details for naming
  const { data: tag, error: tagErr } = await supabase
    .from("platform_tags")
    .select("name")
    .eq("id", tagId)
    .single();

  if (tagErr || !tag) {
    throw new Error(`Tag search failed: ${tagErr?.message}`);
  }

  // 2. Remove binding mapping
  const { error: unbindErr } = await supabase
    .from("platform_lead_tags")
    .delete()
    .eq("lead_id", leadId)
    .eq("tag_id", tagId);

  if (unbindErr) {
    throw new Error(`Failed to remove tag association: ${unbindErr.message}`);
  }

  // 3. Log timeline activity as a system note
  const activity = await createLeadActivity(
    leadId,
    "note_added",
    `Tag "${tag.name}" removed from lead.`,
    {
      system_event: "tag_removed",
      tag_name: tag.name,
    },
    operatorId
  );

  return { tagId, activity };
}

/**
 * Triggers the atomic database transaction RPC to convert a qualified lead to a Customer.
 */
export async function convertLeadToCustomer(
  leadId: string,
  operatorId: string
): Promise<{ customerId: string; activityId: string }> {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase.rpc("convert_lead_to_customer", {
    p_lead_id: leadId,
    p_operator_id: operatorId,
  });

  if (error) {
    console.error("[convertLeadToCustomer] RPC execution error:", error);
    throw new Error(`Database procedure execution failed: ${error.message}`);
  }

  // Parse result payload from JSONB
  const payload = data as { success: boolean; error?: string; customer_id?: string; activity_id?: string };
  if (!payload.success) {
    throw new Error(payload.error || "Customer conversion procedure failed.");
  }

  return {
    customerId: payload.customer_id!,
    activityId: payload.activity_id!,
  };
}

export interface CommercialMetrics {
  totalLeads: number;
  trialCustomers: number;
  expiringSoonCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
  cancelledCustomers: number;
  conversionRate: number;
}

/**
 * Queries live commercial and customer counts for the Platform CRM dashboard.
 */
export async function getPlatformCommercialMetrics(): Promise<CommercialMetrics> {
  const supabase = supabaseAdmin();

  // Query counts in parallel
  const [
    { count: leadsCount },
    { count: trialCount },
    { count: expiringSoonCount },
    { count: activeCount },
    { count: suspendedCount },
    { count: cancelledCount },
  ] = await Promise.all([
    supabase.from("platform_leads").select("id", { count: "exact", head: true }),
    supabase.from("platform_customers").select("id", { count: "exact", head: true }).eq("status", "trial"),
    supabase.from("platform_customers").select("id", { count: "exact", head: true }).eq("status", "trial_expiring"),
    supabase.from("platform_customers").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("platform_customers").select("id", { count: "exact", head: true }).eq("status", "suspended"),
    supabase.from("platform_customers").select("id", { count: "exact", head: true }).eq("status", "cancelled"),
  ]);

  const totalLeads = leadsCount || 0;

  // Calculate live conversion rate: (Converted Leads / Total Leads) * 100
  const { count: convertedCount } = await supabase
    .from("platform_leads")
    .select("id", { count: "exact", head: true })
    .eq("status", "converted");

  const conversionRate = totalLeads > 0 
    ? Math.round(((convertedCount || 0) / totalLeads) * 1000) / 10
    : 0;

  return {
    totalLeads,
    trialCustomers: trialCount || 0,
    expiringSoonCustomers: expiringSoonCount || 0,
    activeCustomers: activeCount || 0,
    suspendedCustomers: suspendedCount || 0,
    cancelledCustomers: cancelledCount || 0,
    conversionRate,
  };
}

export interface CommunicationMetrics {
  sentToday: number;
  successful: number;
  failed: number;
  pending: number;
}

/**
 * Queries live counts of communication events for the platform dashboard.
 */
export async function getPlatformCommunicationMetrics(): Promise<CommunicationMetrics> {
  const supabase = supabaseAdmin();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    { count: sentTodayCount },
    { count: successCount },
    { count: failCount },
    { count: pendCount },
  ] = await Promise.all([
    supabase
      .from("communication_history")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString()),
    supabase
      .from("communication_history")
      .select("id", { count: "exact", head: true })
      .eq("status", "sent"),
    supabase
      .from("communication_history")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed"),
    supabase
      .from("communication_history")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    sentToday: sentTodayCount || 0,
    successful: successCount || 0,
    failed: failCount || 0,
    pending: pendCount || 0,
  };
}

/**
 * Lists all registered Customers from the database, linking workspace slug and status information.
 */
export async function getPlatformCustomers(): Promise<any[]> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("platform_customers")
    .select(`
      *,
      accounts (
        id,
        name,
        slug,
        status,
        trial_starts_at,
        trial_ends_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[repository] getPlatformCustomers failed:", error);
    return [];
  }
  return data || [];
}

/**
 * Resolves full Customer profile, workspace account details, Owner, members counts, and timeline activities.
 */
export async function getPlatformCustomerDetail(customerId: string): Promise<any> {
  const supabase = supabaseAdmin();

  // 1. Fetch customer profile details
  const { data: customer, error: custErr } = await supabase
    .from("platform_customers")
    .select("*")
    .eq("id", customerId)
    .maybeSingle();

  if (custErr || !customer) {
    return null;
  }

  // 2. Fetch linked workspace account
  const { data: account, error: accErr } = await supabase
    .from("accounts")
    .select("*")
    .eq("customer_id", customerId)
    .maybeSingle();

  // 3. Fetch owner profile
  let ownerProfile = null;
  if (account) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("account_id", account.id)
      .eq("account_role", "owner")
      .maybeSingle();
    ownerProfile = profile;
  }

  // 4. Fetch workspace members count
  let membersCount = 0;
  if (account) {
    const { count } = await supabase
      .from("profiles")
      .select("user_id", { count: "exact", head: true })
      .eq("account_id", account.id);
    membersCount = count || 0;
  }

  // 5. Fetch activities history feed and communication logs
  let activities: HydratedActivity[] = [];
  let communications: any[] = [];

  if (customer.lead_id) {
    const [actResult, commResult] = await Promise.all([
      getLeadActivities(customer.lead_id),
      supabase
        .from("communication_history")
        .select("*")
        .eq("lead_id", customer.lead_id)
        .order("created_at", { ascending: false })
    ]);
    activities = actResult;
    communications = commResult.data || [];
  }

  return {
    customer,
    account,
    ownerProfile,
    membersCount,
    activities,
    communications,
  };
}







