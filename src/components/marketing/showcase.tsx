"use client";

import React from "react";
import { BrowserFrame } from "./browser-frame";
import {
  DashboardMockup,
  InboxMockup,
  LeadDetailsMockup,
  CampaignMockup,
  AutomationMockup,
  AnalyticsMockup,
} from "./screen-mockups";

export function Showcase() {
  const tabs = [
    { id: "dashboard", label: "Dashboard", url: "app.syncwa.com/dashboard" },
    { id: "inbox", label: "Inbox", url: "app.syncwa.com/inbox" },
    { id: "leads", label: "Lead Details", url: "app.syncwa.com/pipelines" },
    { id: "campaigns", label: "Campaigns", url: "app.syncwa.com/broadcasts" },
    { id: "automation", label: "Automation", url: "app.syncwa.com/flows" },
    { id: "analytics", label: "Analytics", url: "app.syncwa.com/analytics" },
  ];

  const [activeTab, setActiveTab] = React.useState("dashboard");

  const renderActiveMockup = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardMockup />;
      case "inbox":
        return <InboxMockup />;
      case "leads":
        return <LeadDetailsMockup />;
      case "campaigns":
        return <CampaignMockup />;
      case "automation":
        return <AutomationMockup />;
      case "analytics":
        return <AnalyticsMockup />;
      default:
        return <DashboardMockup />;
    }
  };

  const getActiveUrl = () => {
    return tabs.find((t) => t.id === activeTab)?.url || "app.syncwa.com";
  };

  return (
    <section className="w-full py-16 md:py-20 border-b border-border bg-card/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* Headers */}
        <div className="max-w-3xl space-y-3 text-left">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            See SyncWA in Action
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Take a look at real interfaces from the SyncWA application. Experience structured dashboard metrics, collaborative timelines, visual chatbot editors, and campaign monitors.
          </p>
        </div>

        {/* Tabs selector */}
        <div className="flex overflow-x-auto space-x-1.5 pb-2 border-b border-border select-none scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Display visual screenshot */}
        <div className="w-full max-w-5xl mx-auto pt-4">
          <BrowserFrame url={getActiveUrl()}>
            {renderActiveMockup()}
          </BrowserFrame>
        </div>
      </div>
    </section>
  );
}
