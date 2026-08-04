"use client";

import React from "react";
import {
  MessageSquare,
  Users,
  GitBranch,
  Radio,
  Zap,
  Workflow,
  Bot,
  Settings,
  LayoutDashboard,
  Check,
  Plus,
  Search,
  Clock,
  Coins,
  Send,
  User,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

// Sidebar Dummy
function MockSidebar({ activeTab }: { activeTab: string }) {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "inbox", icon: MessageSquare, label: "Inbox", badge: 4 },
    { id: "contacts", icon: Users, label: "Contacts" },
    { id: "pipelines", icon: GitBranch, label: "Pipelines" },
    { id: "campaigns", icon: Radio, label: "Broadcasts" },
    { id: "automations", icon: Zap, label: "Automations" },
    { id: "flows", icon: Workflow, label: "Flows" },
    { id: "ai", icon: Bot, label: "AI Agents" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-48 bg-card border-r border-border h-[400px] flex flex-col justify-between shrink-0 p-3 hidden md:flex">
      <div className="space-y-4">
        {/* Brand */}
        <div className="flex items-center space-x-2 px-2 py-1">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <MessageSquare className="h-3 w-3" />
          </div>
          <span className="text-sm font-semibold tracking-wider">SyncWA</span>
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeTab;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                  isActive
                    ? "bg-primary-soft text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="h-4 px-1.5 text-[9px] bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User profile profile */}
      <div className="flex items-center space-x-2 p-2 border-t border-border/80">
        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
          A
        </div>
        <div className="truncate">
          <p className="text-[10px] font-semibold truncate leading-none">Admin User</p>
          <span className="text-[8px] text-muted-foreground truncate leading-none">Owner</span>
        </div>
      </div>
    </div>
  );
}

// 1. Dashboard Mockup
export function DashboardMockup() {
  return (
    <div className="flex w-full bg-background text-foreground h-[400px] select-none text-left">
      <MockSidebar activeTab="dashboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-semibold">Workspace Dashboard</h2>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
            Live updates
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Active Conversations",
                value: "1,248",
                change: "+12.4%",
                icon: MessageSquare,
                color: "text-primary bg-primary-soft",
              },
              {
                label: "Unread Chats",
                value: "14",
                change: "Needs attention",
                icon: Clock,
                color: "text-amber-500 bg-amber-500/10",
              },
              {
                label: "Pipeline Value",
                value: "$24,500",
                change: "8 open deals",
                icon: Coins,
                color: "text-emerald-500 bg-emerald-500/10",
              },
              {
                label: "Avg First Response",
                value: "2m 45s",
                change: "-45s saving",
                icon: TrendingUp,
                color: "text-primary bg-primary-soft-2",
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-card p-3 rounded border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                    <div className={`p-1 rounded ${stat.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold">{stat.value}</h3>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{stat.change}</p>
                </div>
              );
            })}
          </div>

          {/* Two Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Conversations */}
            <div className="bg-card border border-border rounded p-3 space-y-3">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Recent Conversations
              </h4>
              <div className="space-y-2">
                {[
                  { name: "Jane Doe", phone: "+1 (555) 123-4567", time: "2m ago", text: "I'd like to book a proposal demo", tag: "VIP", tagColor: "bg-primary-soft text-primary border-primary/20" },
                  { name: "John Smith", phone: "+1 (555) 987-6543", time: "15m ago", text: "Can you send the contract details?", tag: "Lead", tagColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
                  { name: "Alex Mercer", phone: "+44 7911 123456", time: "1h ago", text: "How much is hosting?", tag: "Follow-up", tagColor: "bg-amber-500/10 text-amber-500 border-amber-500/20" }
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 border border-border/40 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center font-bold text-[10px] text-primary">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold">{c.name}</span>
                          <span className={`text-[9px] px-1 border rounded ${c.tagColor}`}>{c.tag}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{c.text}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-muted-foreground shrink-0">{c.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline Stage Funnel */}
            <div className="bg-card border border-border rounded p-3 space-y-3">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Sales Funnel Summary
              </h4>
              <div className="space-y-2.5">
                {[
                  { stage: "Leads Captured", count: 12, value: "$45,000", pct: "w-full bg-primary" },
                  { stage: "Contacted", count: 8, value: "$28,000", pct: "w-[75%] bg-primary/80" },
                  { stage: "Proposal Sent", count: 5, value: "$18,500", pct: "w-[50%] bg-primary/60" },
                  { stage: "Closed Won", count: 3, value: "$9,000", pct: "w-[25%] bg-emerald-500" },
                ].map((f, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between text-[10px] font-medium">
                      <span>{f.stage} ({f.count})</span>
                      <span className="text-muted-foreground">{f.value}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded overflow-hidden">
                      <div className={`h-full rounded ${f.pct}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Inbox Mockup
export function InboxMockup() {
  return (
    <div className="flex w-full bg-background text-foreground h-[400px] select-none text-left">
      <MockSidebar activeTab="inbox" />
      {/* Inbox Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thread List */}
        <div className="w-1/3 border-r border-border flex flex-col overflow-hidden">
          <div className="p-2 border-b border-border flex items-center justify-between shrink-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Inbox</span>
            <Search className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {[
              { name: "Jane Doe", text: "I'd like to book a proposal demo", time: "2m", active: true, unread: true },
              { name: "John Smith", text: "Can you send the contract details?", time: "15m", active: false, unread: false },
              { name: "Alex Mercer", text: "How much is hosting?", time: "1h", active: false, unread: false },
              { name: "Emily Davis", text: "Thank you for the templates list", time: "1d", active: false, unread: false },
            ].map((t, i) => (
              <div
                key={i}
                className={`p-2 cursor-pointer transition-colors text-xs space-y-1 ${
                  t.active ? "bg-muted" : "hover:bg-muted/40"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-[8px] text-muted-foreground">{t.time}</span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate leading-snug">{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-10 border-b border-border px-3 flex items-center justify-between shrink-0 bg-card">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold">Jane Doe</span>
            </div>
            <div className="flex items-center space-x-1 bg-muted px-2 py-0.5 rounded text-[8px] text-muted-foreground">
              <User className="h-2.5 w-2.5" />
              <span>Assigned: Sarah</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-muted/20">
            <div className="flex justify-start">
              <div className="max-w-[75%] bg-card border border-border p-2 rounded-lg text-xs leading-normal">
                Hello! I am looking for a shared WhatsApp dashboard template for our customer support reps.
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[75%] bg-primary text-primary-foreground p-2 rounded-lg text-xs leading-normal">
                Hi Jane! SyncWA is perfect for that. It supports unlimited agents, shared inbox queue, and visual chatbots.
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[75%] bg-card border border-border p-2 rounded-lg text-xs leading-normal">
                That sounds exactly like what we need. I'd like to book a proposal demo to showcase it to the team.
              </div>
            </div>
          </div>

          {/* AI Banner Suggestion */}
          <div className="p-2 bg-primary-soft/40 border-t border-border flex items-center justify-between shrink-0 text-[10px]">
            <div className="flex items-center space-x-1.5">
              <Bot className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground truncate max-w-[200px]">AI Draft: "I can set up a demo for you..."</span>
            </div>
            <button className="px-2 py-0.5 bg-primary text-primary-foreground rounded text-[8px] font-medium hover:bg-primary-hover">
              Apply
            </button>
          </div>

          {/* Composer */}
          <div className="p-2 border-t border-border bg-card flex items-center space-x-2 shrink-0">
            <input
              type="text"
              placeholder="Type your message..."
              disabled
              className="flex-1 bg-background border border-border px-3 py-1.5 rounded text-xs outline-none"
            />
            <div className="h-7 w-7 rounded bg-primary flex items-center justify-center text-primary-foreground cursor-pointer">
              <Send className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Lead Details Mockup
export function LeadDetailsMockup() {
  return (
    <div className="flex w-full bg-background text-foreground h-[400px] select-none text-left">
      <MockSidebar activeTab="pipelines" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0 bg-card">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-semibold">Sales Pipeline</h2>
            <span className="text-[10px] text-muted-foreground font-mono">Currency: USD ($)</span>
          </div>
          <button className="flex items-center space-x-1 px-2.5 py-1 bg-primary text-primary-foreground rounded text-[10px] font-semibold">
            <Plus className="h-3 w-3" />
            <span>Add Deal</span>
          </button>
        </div>

        {/* Board Columns */}
        <div className="flex-1 p-3 overflow-x-auto flex space-x-3 bg-muted/10">
          {[
            {
              title: "New Leads",
              count: 3,
              deals: [
                { client: "Jane Doe", value: "$5,000", tag: "Enterprise", tagColor: "bg-primary-soft text-primary", title: "Custom Setup Proposal" },
                { client: "Bob Vance", value: "$850", tag: "Consulting", tagColor: "bg-amber-500/10 text-amber-500", title: "Onboarding Training" }
              ]
            },
            {
              title: "In Discussion",
              count: 2,
              deals: [
                { client: "John Smith", value: "$1,200", tag: "SaaS", tagColor: "bg-cobalt-500/10 text-primary-soft-2", title: "Standard White-label" }
              ]
            },
            {
              title: "Proposal Sent",
              count: 1,
              deals: [
                { client: "Alex Mercer", value: "$4,500", tag: "Enterprise", tagColor: "bg-primary-soft text-primary", title: "Scale Deployment Package" }
              ]
            },
            {
              title: "Closed Won",
              count: 4,
              deals: [
                { client: "Emily Davis", value: "$3,000", tag: "Education", tagColor: "bg-emerald-500/10 text-emerald-500", title: "Consultant Portal Setup" }
              ]
            }
          ].map((col, i) => (
            <div key={i} className="w-60 bg-card border border-border rounded flex flex-col shrink-0 overflow-hidden h-[320px]">
              <div className="p-2 border-b border-border flex items-center justify-between shrink-0 bg-muted/20">
                <span className="text-xs font-semibold">{col.title}</span>
                <span className="text-[10px] text-muted-foreground font-bold bg-muted px-1.5 py-0.5 rounded">
                  {col.count}
                </span>
              </div>
              <div className="flex-1 p-2 overflow-y-auto space-y-2">
                {col.deals.map((deal, idx) => (
                  <div key={idx} className="bg-background border border-border rounded p-2.5 space-y-2 cursor-pointer hover:border-primary/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className={`text-[8px] px-1.5 py-0.5 border rounded-full ${deal.tagColor}`}>{deal.tag}</span>
                      <span className="text-xs font-bold text-foreground">{deal.value}</span>
                    </div>
                    <p className="text-[10px] font-semibold leading-normal">{deal.title}</p>
                    <div className="flex justify-between items-center text-[8px] text-muted-foreground pt-1 border-t border-border/40">
                      <span>Client: {deal.client}</span>
                      <span>1d ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. Campaign Mockup
export function CampaignMockup() {
  return (
    <div className="flex w-full bg-background text-foreground h-[400px] select-none text-left">
      <MockSidebar activeTab="campaigns" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0 bg-card">
          <h2 className="text-sm font-semibold">Broadcast Campaigns</h2>
          <button className="flex items-center space-x-1 px-3 py-1 bg-primary text-primary-foreground rounded text-[10px] font-semibold">
            <Send className="h-3 w-3" />
            <span>Launch Broadcast</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {/* Active Campaigns */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Recent Outbound Broadcasts</span>
            <div className="border border-border rounded divide-y divide-border overflow-hidden bg-card">
              {[
                { name: "Summer Promo Blast", date: "Aug 02, 2026", recipients: 450, delivered: "100%", read: "88%", status: "Completed", color: "bg-emerald-500 text-white" },
                { name: "Onboarding Welcome Note", date: "Jul 28, 2026", recipients: 120, delivered: "100%", read: "92%", status: "Completed", color: "bg-emerald-500 text-white" },
                { name: "August Newsletter", date: "Scheduled", recipients: 890, delivered: "--", read: "--", status: "Pending", color: "bg-amber-500 text-white" },
              ].map((c, i) => (
                <div key={i} className="p-3 flex items-center justify-between hover:bg-muted/30">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-xs">{c.name}</p>
                    <div className="flex items-center space-x-2 text-[9px] text-muted-foreground">
                      <span>Date: {c.date}</span>
                      <span>•</span>
                      <span>Target: {c.recipients} leads</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-[10px]">
                    <div className="text-right hidden sm:block">
                      <p className="font-medium">Delivered: {c.delivered}</p>
                      <span className="text-[9px] text-muted-foreground">Read: {c.read}</span>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${c.color}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Variables Mapping Preview */}
          <div className="bg-card border border-border rounded p-3 space-y-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Meta Approved Templates (Preview)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 border border-border/80 rounded bg-background space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded">summer_sale_v1</span>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1 rounded">Approved</span>
                </div>
                <div className="p-2 bg-card rounded border border-border/40 text-[10px] text-muted-foreground">
                  Hello <span className="text-primary font-semibold">{"{{1}}"}</span>, get ready for a special summer deal on <span className="text-primary font-semibold">{"{{2}}"}</span>! Reply standard info.
                </div>
              </div>
              <div className="p-2.5 border border-border/80 rounded bg-background space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded">client_onboard_v2</span>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1 rounded">Approved</span>
                </div>
                <div className="p-2 bg-card rounded border border-border/40 text-[10px] text-muted-foreground">
                  Welcome to SyncWA <span className="text-primary font-semibold">{"{{1}}"}</span>! Click the button below to join workspace portal.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Automation Mockup
export function AutomationMockup() {
  return (
    <div className="flex w-full bg-background text-foreground h-[400px] select-none text-left">
      <MockSidebar activeTab="flows" />
      <div className="flex-1 flex flex-col overflow-hidden relative bg-muted/10">
        {/* Header */}
        <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0 bg-card z-10">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-semibold">Visual Flows Editor</h2>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
              Active: welcome_menu
            </span>
          </div>
          <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-[10px] font-semibold">
            Save Changes
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden relative p-4 flex items-center justify-center">
          {/* Background grid representation */}
          <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

          {/* Node 1 */}
          <div className="absolute top-8 left-6 w-44 bg-card border-2 border-primary rounded p-2.5 space-y-1 shadow-lg z-10">
            <div className="flex items-center justify-between border-b border-border/60 pb-1">
              <span className="text-[8px] font-bold text-primary uppercase">Trigger Node</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[10px] font-semibold">Inbound Message</p>
            <span className="text-[8px] text-muted-foreground block">Event: Message Received</span>
          </div>

          {/* Arrow SVG 1 */}
          <svg className="absolute top-16 left-52 w-16 h-12 z-0">
            <path d="M 0 0 L 50 0" stroke="var(--primary)" strokeWidth="2" fill="none" strokeDasharray="4" />
            <polygon points="50,-4 58,0 50,4" fill="var(--primary)" />
          </svg>

          {/* Node 2 */}
          <div className="absolute top-6 left-[236px] w-48 bg-card border border-border rounded p-2.5 space-y-1 shadow-lg z-10">
            <div className="flex items-center justify-between border-b border-border/60 pb-1">
              <span className="text-[8px] font-bold text-amber-500 uppercase">Condition Node</span>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <p className="text-[10px] font-semibold">Check Content Text</p>
            <span className="text-[8px] text-muted-foreground block">Matches keyword: "price" / "pricing"</span>
          </div>

          {/* Arrow SVG 2 (Split) */}
          <svg className="absolute top-20 left-[432px] w-12 h-20 z-0">
            <path d="M 0 0 L 20 0 L 20 40 L 40 40" stroke="var(--border)" strokeWidth="2" fill="none" />
            <polygon points="35,36 43,40 35,44" fill="var(--border)" />
          </svg>

          {/* Node 3 */}
          <div className="absolute top-[120px] left-[450px] w-48 bg-card border border-border rounded p-2.5 space-y-1 shadow-lg z-10">
            <div className="flex items-center justify-between border-b border-border/60 pb-1">
              <span className="text-[8px] font-bold text-emerald-500 uppercase">Action Node</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[10px] font-semibold">Send WhatsApp Button</p>
            <span className="text-[8px] text-muted-foreground block">Body: "Here is our pricing list"</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Analytics Mockup
export function AnalyticsMockup() {
  return (
    <div className="flex w-full bg-background text-foreground h-[400px] select-none text-left">
      <MockSidebar activeTab="ai" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0 bg-card">
          <h2 className="text-sm font-semibold">Reports & AI Insights</h2>
          <span className="text-[10px] text-muted-foreground">Month-to-date stats</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Conversations Over Time (Bar Chart) */}
            <div className="bg-card border border-border rounded p-3 space-y-3">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Incoming Volume (Weekly)</h4>
              <div className="flex items-end justify-between h-28 pt-2">
                {[
                  { week: "W1", val: "h-12" },
                  { week: "W2", val: "h-20" },
                  { week: "W3", val: "h-24" },
                  { week: "W4", val: "h-16" },
                  { week: "W5", val: "h-28" }
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center space-y-2 flex-1">
                    <div className="w-6 bg-primary rounded-t transition-all hover:bg-primary-hover relative group">
                      <div className={`w-full rounded-t ${b.val}`} />
                    </div>
                    <span className="text-[8px] text-muted-foreground">{b.week}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Token allocation */}
            <div className="bg-card border border-border rounded p-3 space-y-3">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase">AI Token Spent Allocation</h4>
              <div className="space-y-3 pt-1">
                {[
                  { name: "OpenAI GPT-4o", tokens: "450k tokens", val: "75%", color: "bg-primary" },
                  { name: "Anthropic Claude 3.5 Sonnet", tokens: "120k tokens", val: "20%", color: "bg-primary/60" },
                  { name: "OpenAI Embeddings", tokens: "30k tokens", val: "5%", color: "bg-primary/30" }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[9px]">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-muted-foreground">{item.tokens}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded overflow-hidden">
                      <div className={`h-full rounded ${item.color}`} style={{ width: item.val }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agents Performance list */}
          <div className="bg-card border border-border rounded p-3 space-y-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Agent Response Speed</h4>
            <div className="space-y-2">
              {[
                { name: "Sarah Jenkins", resolved: 145, time: "1m 12s", pct: "w-full bg-emerald-500" },
                { name: "Alex Mercer", resolved: 98, time: "2m 15s", pct: "w-[75%] bg-primary" },
                { name: "AI Auto-reply Bot", resolved: 412, time: "8s (Avg)", pct: "w-full bg-primary-soft-2" }
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] p-2 hover:bg-muted/30 border border-border/40 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center font-bold text-[8px] text-primary">
                      {a.name[0]}
                    </div>
                    <span className="font-semibold">{a.name}</span>
                  </div>
                  <div className="flex space-x-6 text-right font-mono">
                    <div>
                      <p className="text-muted-foreground text-[8px]">Resolved</p>
                      <span className="font-bold">{a.resolved}</span>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[8px]">First Response</p>
                      <span className="font-bold text-foreground">{a.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. CRM Contact Details Mockup
export function ContactDetailsMockup() {
  return (
    <div className="flex w-full bg-background text-foreground h-[400px] select-none text-left">
      <MockSidebar activeTab="contacts" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0 bg-card">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold">Contact Info</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">ID: con_jane_doe_123</span>
        </div>
        {/* Main Info */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          <div className="flex items-start justify-between border-b border-border pb-3">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground">JD</div>
              <div>
                <h3 className="text-sm font-bold">Jane Doe</h3>
                <p className="text-[10px] text-muted-foreground">E.164 Normalized: +1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex space-x-1.5">
              <span className="text-[8px] bg-primary-soft border border-primary/20 text-primary px-2 py-0.5 rounded font-bold">VIP</span>
              <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded font-bold">Active Lead</span>
            </div>
          </div>
          {/* Split */}
          <div className="grid grid-cols-2 gap-4">
            {/* Fields */}
            <div className="bg-card border border-border rounded p-3 space-y-2.5">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Custom Metadata Fields</span>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground text-[9px] block">Company</span>
                  <p className="font-semibold text-xs">Vance Refrigeration</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[9px] block">Industry</span>
                  <p className="font-semibold text-xs">Commercial Cooling</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[9px] block">Source</span>
                  <p className="font-semibold text-xs">WhatsApp Inbound Webhook</p>
                </div>
              </div>
            </div>
            {/* Notes */}
            <div className="bg-card border border-border rounded p-3 space-y-2.5">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Internal Activity Notes</span>
              <div className="space-y-2">
                <div className="p-2 bg-background border border-border/40 rounded">
                  <p className="font-semibold text-[10px] text-foreground">Sarah Jenkins</p>
                  <p className="text-[9px] text-muted-foreground font-medium">Scheduled demo call for Tuesday 2 PM.</p>
                </div>
                <div className="p-2 bg-background border border-border/40 rounded">
                  <p className="font-semibold text-[10px] text-primary">AI Auto-reply Bot</p>
                  <p className="text-[9px] text-muted-foreground font-medium">Delivered grounded pricing FAQ document response.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. Team Collaboration (Team Management) Mockup
export function TeamManagementMockup() {
  return (
    <div className="flex w-full bg-background text-foreground h-[400px] select-none text-left">
      <MockSidebar activeTab="settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0 bg-card">
          <h2 className="text-sm font-semibold">Team Members Settings</h2>
          <button className="px-2.5 py-1 bg-primary text-primary-foreground rounded text-[10px] font-semibold">Invite Member</button>
        </div>
        {/* Roster list */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Workspace Members</span>
            <div className="border border-border rounded bg-card divide-y divide-border overflow-hidden">
              {[
                { name: "Sarah Jenkins (You)", email: "sarah@company.com", role: "owner", status: "Active", presence: "bg-emerald-500" },
                { name: "Alex Mercer", email: "alex@company.com", role: "admin", status: "Active", presence: "bg-emerald-500" },
                { name: "John Smith", email: "john@company.com", role: "agent", status: "Active", presence: "bg-muted" },
                { name: "Emily Davis", email: "emily@company.com", role: "viewer", status: "Active", presence: "bg-muted" }
              ].map((member, i) => (
                <div key={i} className="p-2.5 flex items-center justify-between hover:bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <span className={`h-2 w-2 rounded-full ${member.presence}`} />
                    <div>
                      <p className="font-semibold text-xs">{member.name}</p>
                      <p className="text-[9px] text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-[9px] font-mono bg-muted border border-border/80 px-2 py-0.5 rounded uppercase">
                      {member.role}
                    </span>
                    <span className="text-[9px] text-emerald-500 font-semibold">{member.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Active Invites links */}
          <div className="bg-muted/30 border border-border rounded p-3 space-y-2">
            <span className="text-[9px] font-bold text-muted-foreground uppercase">Active Invite Links</span>
            <div className="flex items-center justify-between bg-card border border-border rounded px-3 py-1.5 text-[10px]">
              <span className="font-mono text-muted-foreground">https://wacrm.com/join/tok_admin_71239...</span>
              <span className="text-[8px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-bold">Admin Role</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 9. AI Workspace Mockup
export function AiWorkspaceMockup() {
  return (
    <div className="flex w-full bg-background text-foreground h-[400px] select-none text-left">
      <MockSidebar activeTab="ai" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0 bg-card">
          <h2 className="text-sm font-semibold">AI Assistant Workspace</h2>
          <span className="text-[9px] bg-primary-soft text-primary border border-primary/20 px-1.5 py-0.5 rounded font-mono">Provider: OpenAI + Anthropic</span>
        </div>
        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            {/* Document Vector Chunking */}
            <div className="bg-card border border-border rounded p-3 space-y-2.5">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">FAQ Vector Grounding Documents</span>
              <div className="space-y-2">
                {[
                  { name: "general_faq.pdf", chunks: "45 vector chunks", status: "Indexed" },
                  { name: "pricing_terms_v2.txt", chunks: "12 vector chunks", status: "Indexed" }
                ].map((doc, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-background border border-border/40 rounded text-[10px]">
                    <div>
                      <p className="font-semibold">{doc.name}</p>
                      <span className="text-[8px] text-muted-foreground">{doc.chunks}</span>
                    </div>
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 rounded font-bold">{doc.status}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* AI Playground Sandbox */}
            <div className="bg-card border border-border rounded p-3 flex flex-col justify-between h-[180px]">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">AI Grounding Sandbox (Playground)</span>
              <div className="flex-1 bg-background border border-border/40 rounded p-2 overflow-y-auto space-y-2 my-2 text-[10px]">
                <div>
                  <span className="text-[8px] text-primary font-bold">User:</span>
                  <p className="text-foreground leading-normal">What are the pricing options for SyncWA?</p>
                </div>
                <div className="border-t border-border/20 pt-1">
                  <span className="text-[8px] text-emerald-500 font-bold">AI Assistant (Grounded):</span>
                  <p className="text-muted-foreground leading-normal">SyncWA is a self-hostable template with zero agent seat fees. You only pay for direct hosting and Meta API consumption.</p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <input type="text" placeholder="Type test query..." disabled className="flex-1 bg-background border border-border px-2 py-1 rounded text-[9px] outline-none" />
                <button className="px-2.5 py-1 bg-primary text-primary-foreground rounded text-[9px] font-semibold">Test</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
