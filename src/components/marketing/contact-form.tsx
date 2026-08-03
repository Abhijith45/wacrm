"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    businessEmail: "",
    phoneNumber: "",
    companySize: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!form.businessEmail.trim()) {
      newErrors.businessEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.businessEmail)) {
      newErrors.businessEmail = "Please enter a valid email address";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success transition
    setSubmitted(true);
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
    <form onSubmit={handleSubmit} className="p-6 bg-card border border-border rounded-2xl space-y-5 text-left">
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-foreground">Send Us a Message</h3>
        <p className="text-xs text-muted-foreground leading-normal">
          Complete the form below and our team will get back to you as soon as possible.
        </p>
      </div>

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
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select size...</option>
            <option value="1-5">1 - 5 employees</option>
            <option value="6-20">6 - 20 employees</option>
            <option value="21-50">21 - 50 employees</option>
            <option value="50+">50+ employees</option>
          </select>
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
            className={cn(errors.subject && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.subject && <p className="text-[10px] text-destructive">{errors.subject}</p>}
        </div>
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
          className={cn(errors.message && "border-destructive focus-visible:ring-destructive", "resize-none text-xs")}
        />
        {errors.message && <p className="text-[10px] text-destructive">{errors.message}</p>}
      </div>

      <Button type="submit" className="w-full text-xs cursor-pointer">
        Send Message
      </Button>
    </form>
  );
}
