export type CommunicationEvent =
  | "CUSTOMER_CONVERTED"
  | "WORKSPACE_PROVISIONED"
  | "OWNER_INVITED"
  | "TRIAL_STARTED"
  | "ONBOARDING_REMINDER"
  | "TRIAL_EXPIRING"
  | "TRIAL_EXPIRED"
  | "ONBOARDING_COMPLETED";

export type CommunicationStatus = "pending" | "sent" | "failed";

export interface CommunicationHistoryRecord {
  id: string;
  recipient: string;
  template_name: string;
  status: CommunicationStatus;
  provider: string;
  retry_count: number;
  failure_reason: string | null;
  delivery_result: any | null;
  lead_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
}

export interface EmailProviderInterface {
  sendEmail(options: EmailOptions): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    rawResponse?: any;
  }>;
}
