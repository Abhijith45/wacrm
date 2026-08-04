import type { EmailOptions, EmailProviderInterface } from "./types";

export class MockEmailProvider implements EmailProviderInterface {
  async sendEmail(options: EmailOptions): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    rawResponse?: any;
  }> {
    // Simulated mock delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log("[MockEmailProvider] dispatching email message:", {
      to: options.to,
      subject: options.subject,
      length: options.bodyText.length,
    });

    // In sandbox environment, simulate success
    const mockMsgId = `mock-msg-${Math.random().toString(36).substring(2, 11)}`;
    return {
      success: true,
      messageId: mockMsgId,
      rawResponse: {
        provider: "MockEmailService",
        dispatched_at: new Date().toISOString(),
        to: options.to,
        messageId: mockMsgId,
      },
    };
  }
}
