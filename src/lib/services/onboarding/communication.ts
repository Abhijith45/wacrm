export interface WelcomeEmailOptions {
  email: string;
  fullName: string;
  loginUrl: string;
  trialEndsAt: string;
}

export interface CommunicationProvider {
  sendWelcomeEmail(options: WelcomeEmailOptions): Promise<boolean>;
  sendGettingStartedGuide(email: string, fullName: string): Promise<boolean>;
}

export class MockCommunicationProvider implements CommunicationProvider {
  async sendWelcomeEmail(options: WelcomeEmailOptions): Promise<boolean> {
    console.log("[WelcomeCommunicationService] MOCK: Welcome email triggered.", options);
    return true;
  }

  async sendGettingStartedGuide(email: string, fullName: string): Promise<boolean> {
    console.log(`[WelcomeCommunicationService] MOCK: Sending getting started guide to ${email} for ${fullName}.`);
    return true;
  }
}

export class WelcomeCommunicationService {
  private provider: CommunicationProvider;

  constructor(provider: CommunicationProvider = new MockCommunicationProvider()) {
    this.provider = provider;
  }

  /**
   * Triggers the onboarding welcome email containing access credentials.
   */
  async triggerWelcomeEmail(options: WelcomeEmailOptions): Promise<boolean> {
    try {
      return await this.provider.sendWelcomeEmail(options);
    } catch (err) {
      console.error("[WelcomeCommunicationService] Welcome email trigger failed:", err);
      return false;
    }
  }

  /**
   * Triggers a follow-up getting started guide.
   */
  async triggerGettingStartedGuide(email: string, fullName: string): Promise<boolean> {
    try {
      return await this.provider.sendGettingStartedGuide(email, fullName);
    } catch (err) {
      console.error("[WelcomeCommunicationService] Getting started guide trigger failed:", err);
      return false;
    }
  }
}
