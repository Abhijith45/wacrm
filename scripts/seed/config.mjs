// ===========================================================================
// SyncWA Development Data Seeder — Central Configuration
// ===========================================================================

// ── Platform Owner ──────────────────────────────────────────────────────────
export const PLATFORM_OWNER = {
  email: "founder@syncwa.com",
  password: "SyncWA@Founder2026!",
  fullName: "Abhijeet Rawat",
  platformRole: "founder",
};

// ── Realistic Name Pools ────────────────────────────────────────────────────
export const FIRST_NAMES = [
  "Arjun", "Priya", "Rahul", "Sneha", "Vikram", "Ananya", "Karan", "Meera",
  "Rohan", "Neha", "Aditya", "Kavita", "Sanjay", "Divya", "Amit", "Pooja",
  "Nikhil", "Riya", "Suresh", "Anjali", "Deepak", "Shreya", "Manish", "Tanvi",
  "Rajesh", "Ishita", "Ashish", "Nisha", "Varun", "Simran", "Gaurav", "Pallavi",
  "Akash", "Swati", "Harsh", "Ritika", "Vivek", "Komal", "Tarun", "Bhavna",
  "Omar", "Fatima", "Carlos", "Maria", "James", "Sarah", "David", "Emma",
  "Michael", "Sophie",
];

export const LAST_NAMES = [
  "Sharma", "Patel", "Kumar", "Singh", "Gupta", "Verma", "Joshi", "Mehta",
  "Malhotra", "Reddy", "Nair", "Iyer", "Chopra", "Bhatia", "Saxena", "Kapoor",
  "Agarwal", "Tiwari", "Banerjee", "Das", "Chauhan", "Yadav", "Srivastava",
  "Mishra", "Pandey", "Dubey", "Rao", "Pillai", "Menon", "Thakur",
  "Al-Rashid", "Garcia", "Smith", "Johnson", "Williams", "Brown", "Jones",
  "Miller", "Davis", "Wilson",
];

export const COMPANY_NAMES = [
  "TechNova Solutions", "CloudPeak Industries", "DigitalBridge Corp",
  "SwiftEdge Technologies", "NexGen Marketing", "PrimeWave Analytics",
  "ClearPath Consulting", "BrightStar Innovations", "Apex Digital Agency",
  "FusionGrid Systems", "MetroScale Ventures", "ZenithFlow Labs",
  "CoreSync Enterprises", "PulsePoint Media", "DataForge Inc",
  "BlueSky Commerce", "IronClad Security", "VeloCity Logistics",
  "QuantumLeap AI", "OmniChannel Retail", "EverGreen Fintech",
  "SparkLine Creative", "HorizonX Partners", "TrueNorth Consulting",
  "WaveForm Studios", "PeakView Capital", "CrystalNet Telecom",
  "RedOak Hospitality", "SilverLake Properties", "GoldenGate Imports",
];

export const INDUSTRIES = [
  "SaaS", "E-Commerce", "FinTech", "HealthTech", "EdTech", "Real Estate",
  "Marketing Agency", "Logistics", "Retail", "Hospitality", "Manufacturing",
  "Consulting", "Media", "Telecommunications", "Insurance",
];

export const COMPANY_SIZES = [
  "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+",
];

// ── Lead Configuration ──────────────────────────────────────────────────────
export const LEAD_SOURCES = [
  "website", "facebook", "google_ads", "referral", "whatsapp", "linkedin",
  "contact_form", "twitter", "email_campaign", "partner",
];

export const LEAD_STATUSES_DISTRIBUTION = [
  { status: "new", weight: 20 },
  { status: "contacted", weight: 15 },
  { status: "qualified", weight: 15 },
  { status: "demo_scheduled", weight: 10 },
  { status: "demo_completed", weight: 10 },
  { status: "converted", weight: 10 },
  { status: "lost", weight: 10 },
  { status: "unqualified", weight: 5 },
  { status: "trial_active", weight: 5 },
];

export const INTEREST_AREAS = [
  "WhatsApp Business API", "CRM Features", "Automation", "Broadcasting",
  "Team Collaboration", "Contact Management", "Pipeline Management",
  "API Integration", "Analytics & Reports", "Custom Workflows",
];

export const LEAD_MESSAGES = [
  "We're looking for a WhatsApp CRM solution for our sales team. Can you share more details?",
  "Interested in your automation features. How does it integrate with our existing workflow?",
  "Our team needs a shared inbox for WhatsApp. What plans do you offer?",
  "We want to broadcast messages to our customer base. What are the limits?",
  "Looking for a CRM that supports WhatsApp Business API natively.",
  "We need pipeline management with WhatsApp integration. Is that possible?",
  "Can your platform handle multi-agent support for WhatsApp conversations?",
  "We're evaluating CRM solutions. How does SyncWA compare to competitors?",
  "Interested in the self-hosted option. What are the technical requirements?",
  "We need to import our existing contacts and conversation history.",
  "Our agency manages multiple client WhatsApp accounts. Do you support that?",
  "Looking for API access to build custom integrations with our internal tools.",
  "We need automated follow-up sequences for our WhatsApp leads.",
  "Can we use your platform for customer support ticketing via WhatsApp?",
  "We're a startup looking for an affordable WhatsApp CRM solution.",
];

// ── Activity Configuration ──────────────────────────────────────────────────
export const ACTIVITY_NOTES = {
  note_added: [
    "Initial contact made. Client expressed strong interest in automation features.",
    "Follow-up scheduled for next week. Needs approval from management.",
    "Pricing discussion completed. Preparing custom proposal.",
    "Technical requirements gathered. No blockers identified.",
    "Client requested case studies from similar industry verticals.",
    "Budget approved internally. Moving forward with demo scheduling.",
    "Competitor analysis shared. Client appreciates feature comparison.",
    "Integration requirements documented. API access will be needed.",
  ],
  email_sent: [
    "Welcome email sent with product overview and demo link.",
    "Follow-up email with pricing tiers and feature comparison.",
    "Custom proposal document attached and sent.",
    "Case study and testimonials shared via email.",
    "Technical documentation and API reference sent.",
    "Trial activation confirmation email dispatched.",
  ],
  call_made: [
    "Discovery call completed. 30 minutes. Key pain points identified.",
    "Product demo call. 45 minutes. Client impressed with automation builder.",
    "Technical deep-dive call with client's engineering team.",
    "Pricing negotiation call. Volume discount discussed.",
    "Follow-up call to address pending questions about data migration.",
    "Onboarding kick-off call scheduled and confirmed.",
  ],
  status_changed: [
    "Lead progressed based on engagement score.",
    "Status updated after successful demo completion.",
    "Moved to qualified after budget confirmation.",
    "Advanced to proposal stage after requirements alignment.",
  ],
  demo_completed: [
    "Full product demo delivered. Client impressed with real-time messaging capabilities.",
    "Demo focused on automation features. Client requested custom workflow example.",
    "Technical demo with IT team. Integration feasibility confirmed.",
  ],
  assigned: [
    "Lead assigned based on territory and expertise alignment.",
    "Reassigned for specialized technical support.",
    "Assigned to senior account executive for enterprise deal.",
  ],
};

// ── Pipeline Configuration ──────────────────────────────────────────────────
export const DEFAULT_PIPELINE = {
  name: "Sales Pipeline",
  stages: [
    { name: "New Lead", color: "#3b82f6", position: 0 },
    { name: "Qualified", color: "#eab308", position: 1 },
    { name: "Proposal Sent", color: "#f97316", position: 2 },
    { name: "Negotiation", color: "#8b5cf6", position: 3 },
    { name: "Won", color: "#22c55e", position: 4 },
  ],
};

export const ADDITIONAL_PIPELINES = [
  {
    name: "Support Pipeline",
    stages: [
      { name: "Open", color: "#ef4444", position: 0 },
      { name: "In Progress", color: "#f59e0b", position: 1 },
      { name: "Waiting on Customer", color: "#6366f1", position: 2 },
      { name: "Resolved", color: "#22c55e", position: 3 },
    ],
  },
  {
    name: "Onboarding Pipeline",
    stages: [
      { name: "Setup", color: "#3b82f6", position: 0 },
      { name: "Training", color: "#8b5cf6", position: 1 },
      { name: "Go Live", color: "#f97316", position: 2 },
      { name: "Completed", color: "#22c55e", position: 3 },
    ],
  },
];

// ── Tag Configuration ───────────────────────────────────────────────────────
export const PLATFORM_TAGS = [
  { name: "hot_lead", color: "#ef4444" },
  { name: "enterprise", color: "#8b5cf6" },
  { name: "startup", color: "#3b82f6" },
  { name: "priority", color: "#f59e0b" },
  { name: "follow_up", color: "#f97316" },
  { name: "demo_requested", color: "#06b6d4" },
  { name: "pricing_discussed", color: "#84cc16" },
  { name: "technical_review", color: "#6366f1" },
];

export const WORKSPACE_TAGS = [
  { name: "new_contact", color: "#3b82f6" },
  { name: "vip", color: "#eab308" },
  { name: "supporter", color: "#22c55e" },
];

// ── Communication Templates ─────────────────────────────────────────────────
export const COMMUNICATION_TEMPLATES = [
  "welcome",
  "workspace_ready",
  "trial_started",
  "onboarding_reminder",
  "trial_expiring",
  "onboarding_completed",
];

// ── Customer Configurations ─────────────────────────────────────────────────
export const CUSTOMER_CONFIGS = {
  demo: [
    {
      companyName: "TechNova Solutions",
      ownerEmail: "owner@technova-demo.com",
      ownerName: "Arjun Sharma",
      companySize: "51-200",
      admins: 1,
      agents: 3,
    },
    {
      companyName: "CloudPeak Industries",
      ownerEmail: "owner@cloudpeak-demo.com",
      ownerName: "Priya Patel",
      companySize: "11-50",
      admins: 1,
      agents: 3,
    },
    {
      companyName: "DigitalBridge Corp",
      ownerEmail: "owner@digitalbridge-demo.com",
      ownerName: "Rahul Kumar",
      companySize: "201-500",
      admins: 1,
      agents: 3,
    },
  ],
  testing: [
    { companyName: "LoadTest Alpha Corp", ownerEmail: "owner@alpha-test.com", ownerName: "Test Alpha", companySize: "51-200", admins: 2, agents: 5 },
    { companyName: "LoadTest Beta Inc", ownerEmail: "owner@beta-test.com", ownerName: "Test Beta", companySize: "11-50", admins: 2, agents: 5 },
    { companyName: "LoadTest Gamma Ltd", ownerEmail: "owner@gamma-test.com", ownerName: "Test Gamma", companySize: "201-500", admins: 2, agents: 5 },
    { companyName: "LoadTest Delta Co", ownerEmail: "owner@delta-test.com", ownerName: "Test Delta", companySize: "501-1000", admins: 2, agents: 5 },
    { companyName: "LoadTest Epsilon SA", ownerEmail: "owner@epsilon-test.com", ownerName: "Test Epsilon", companySize: "1-10", admins: 2, agents: 5 },
    { companyName: "LoadTest Zeta GmbH", ownerEmail: "owner@zeta-test.com", ownerName: "Test Zeta", companySize: "51-200", admins: 2, agents: 5 },
    { companyName: "LoadTest Eta BV", ownerEmail: "owner@eta-test.com", ownerName: "Test Eta", companySize: "11-50", admins: 2, agents: 5 },
    { companyName: "LoadTest Theta Pty", ownerEmail: "owner@theta-test.com", ownerName: "Test Theta", companySize: "201-500", admins: 2, agents: 5 },
    { companyName: "LoadTest Iota LLC", ownerEmail: "owner@iota-test.com", ownerName: "Test Iota", companySize: "51-200", admins: 2, agents: 5 },
    { companyName: "LoadTest Kappa AG", ownerEmail: "owner@kappa-test.com", ownerName: "Test Kappa", companySize: "1000+", admins: 2, agents: 5 },
  ],
  production: [],
};

// ── Profile Quantities ──────────────────────────────────────────────────────
export const PROFILE_QUANTITIES = {
  demo: {
    leadsPerCustomer: 50,
    activitiesPerLead: { min: 3, max: 8 },
    communicationsPerConvertedLead: { min: 2, max: 5 },
    additionalPipelines: false,
  },
  testing: {
    leadsPerCustomer: 300,
    activitiesPerLead: { min: 5, max: 15 },
    communicationsPerConvertedLead: { min: 3, max: 8 },
    additionalPipelines: true,
  },
  production: {
    leadsPerCustomer: 0,
    activitiesPerLead: { min: 0, max: 0 },
    communicationsPerConvertedLead: { min: 0, max: 0 },
    additionalPipelines: false,
  },
};

// ── Date Configuration ──────────────────────────────────────────────────────
export const SEED_DATE_RANGE_DAYS = 90;
