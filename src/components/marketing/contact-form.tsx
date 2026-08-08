"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");
  
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    businessEmail: "",
    phoneNumber: "",
    companySize: "",
    subject: "",
    message: "",
    requestType: ""
  });
  
  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    referrer_url: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Capture UTM parameters from URL and Referrer from browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setUtmParams({
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_content: params.get("utm_content") || "",
        utm_term: params.get("utm_term") || "",
        referrer_url: document.referrer || ""
      });
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    // Clear global error when user edits
    if (globalError) {
      setGlobalError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setGlobalError("");
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!form.businessEmail.trim()) {
      newErrors.businessEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.businessEmail)) {
      newErrors.businessEmail = "Please enter a valid email address";
    }
    if (!form.requestType.trim()) newErrors.requestType = "Please select how we can help you";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          ...utmParams,
          source: "contact_form"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // Successful submission
      setSubmitted(true);
    } catch (err) {
      console.error("[ContactForm] submission error:", err);
      setGlobalError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 bg-card border border-border rounded-2xl text-center space-y-4 animate-fade-in">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-foreground">Thank you for contacting SyncWA.</h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
          Our team has received your message and will respond as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-card border border-border rounded-2xl space-y-5 text-left select-none">
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-foreground">Send Us a Message</h3>
        <p className="text-xs text-muted-foreground leading-normal">
          Complete the form below and our team will get back to you as soon as possible.
        </p>
      </div>

      {/* Global Error Banner */}
      {globalError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start space-x-3 text-destructive animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="text-xs leading-normal font-semibold">{globalError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs font-semibold">
            Full Name <span className="text-primary">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Jane Doe"
            disabled={submitting}
            className={cn(errors.fullName && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.fullName && <p className="text-[10px] text-destructive">{errors.fullName}</p>}
        </div>

        {/* Company Name */}
        <div className="space-y-1.5">
          <Label htmlFor="companyName" className="text-xs font-semibold">
            Company Name <span className="text-primary">*</span>
          </Label>
          <Input
            id="companyName"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="Acme Corp"
            disabled={submitting}
            className={cn(errors.companyName && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.companyName && <p className="text-[10px] text-destructive">{errors.companyName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Business Email */}
        <div className="space-y-1.5">
          <Label htmlFor="businessEmail" className="text-xs font-semibold">
            Business Email <span className="text-primary">*</span>
          </Label>
          <Input
            id="businessEmail"
            name="businessEmail"
            type="email"
            value={form.businessEmail}
            onChange={handleChange}
            placeholder="jane@company.com"
            disabled={submitting}
            className={cn(errors.businessEmail && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.businessEmail && <p className="text-[10px] text-destructive">{errors.businessEmail}</p>}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber" className="text-xs font-semibold">
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            disabled={submitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* How can we help you? */}
        <div className="space-y-1.5">
          <Label htmlFor="requestType" className="text-xs font-semibold">
            How can we help you? <span className="text-primary">*</span>
          </Label>
          <select
            id="requestType"
            name="requestType"
            value={form.requestType}
            onChange={handleChange}
            disabled={submitting}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              errors.requestType && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <option value="">Select option...</option>
            <option value="DEMO">Book a Demo</option>
            <option value="ONBOARDING">Start Using SyncWA</option>
            <option value="GENERAL">General Enquiry</option>
            <option value="PARTNERSHIP">Partnership</option>
            <option value="TECHNICAL">Technical Question</option>
          </select>
          {errors.requestType && <p className="text-[10px] text-destructive">{errors.requestType}</p>}
        </div>

        {/* Company Size */}
        <div className="space-y-1.5">
          <Label htmlFor="companySize" className="text-xs font-semibold">
            Company Size
          </Label>
          <select
            id="companySize"
            name="companySize"
            value={form.companySize}
            onChange={handleChange}
            disabled={submitting}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select size...</option>
            <option value="1-5">1 - 5 employees</option>
            <option value="6-20">6 - 20 employees</option>
            <option value="21-50">21 - 50 employees</option>
            <option value="50+">50+ employees</option>
          </select>
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <Label htmlFor="subject" className="text-xs font-semibold">
          Subject <span className="text-primary">*</span>
        </Label>
        <Input
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Product Demo, Pricing inquiry, etc."
          disabled={submitting}
          className={cn(errors.subject && "border-destructive focus-visible:ring-destructive")}
        />
        {errors.subject && <p className="text-[10px] text-destructive">{errors.subject}</p>}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-xs font-semibold">
          Message <span className="text-primary">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us how we can help you..."
          disabled={submitting}
          className={cn(errors.message && "border-destructive focus-visible:ring-destructive", "resize-none text-xs")}
        />
        {errors.message && <p className="text-[10px] text-destructive">{errors.message}</p>}
      </div>

      <Button type="submit" className="w-full text-xs cursor-pointer" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Message...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
