export interface TemplateVariables {
  customerName?: string;
  companyName?: string;
  workspaceUrl?: string;
  trialEndsAt?: string;
  loginUrl?: string;
  [key: string]: any;
}

export class CommunicationTemplateService {
  /**
   * Renders the subject and content bodies for a given template key and variables.
   */
  static render(
    templateName: string,
    variables: TemplateVariables
  ): { subject: string; bodyText: string; bodyHtml: string } {
    const customerName = variables.customerName || "Customer";
    const companyName = variables.companyName || "Organization";
    const workspaceUrl = variables.workspaceUrl || "https://syncwa.com";
    const trialEndsAt = variables.trialEndsAt ? new Date(variables.trialEndsAt).toLocaleDateString() : "N/A";
    const loginUrl = variables.loginUrl || "https://syncwa.com/login";

    let subject = "";
    let bodyText = "";
    let bodyHtml = "";

    switch (templateName) {
      case "welcome":
        subject = `Welcome to SyncWA, ${customerName}!`;
        bodyText = `Hello ${customerName},\n\nWelcome to SyncWA! Your commercial profile has been successfully set up for ${companyName}. We are preparing your dedicated workspace now.\n\nBest,\nSyncWA Team`;
        bodyHtml = `<p>Hello <strong>${customerName}</strong>,</p><p>Welcome to SyncWA! Your commercial profile has been successfully set up for <strong>${companyName}</strong>. We are preparing your dedicated workspace now.</p><p>Best,<br/>SyncWA Team</p>`;
        break;

      case "workspace_ready":
        subject = `Your SyncWA Workspace is Ready!`;
        bodyText = `Hello ${customerName},\n\nGreat news! Your SyncWA workspace is ready for use. Access it here: ${workspaceUrl}\n\nLogin credentials:\nEmail: ${variables.ownerEmail || "your email"}\nTemporary password: provided upon login.\n\nBest,\nSyncWA Team`;
        bodyHtml = `<p>Hello <strong>${customerName}</strong>,</p><p>Great news! Your SyncWA workspace is ready for use. Access it here: <a href="${workspaceUrl}">${workspaceUrl}</a></p><p>Login credentials:<br/>Email: <strong>${variables.ownerEmail || "your email"}</strong></p><p>Best,<br/>SyncWA Team</p>`;
        break;

      case "trial_started":
        subject = `SyncWA 14-Day Free Trial Started`;
        bodyText = `Hello ${customerName},\n\nYour 14-day free trial has been initialized. Your trial period ends on ${trialEndsAt}.\n\nDaily broadcast limits: 50 messages/day.\n\nLogin to workspace: ${loginUrl}\n\nBest,\nSyncWA Team`;
        bodyHtml = `<p>Hello <strong>${customerName}</strong>,</p><p>Your 14-day free trial has been initialized. Your trial period ends on <strong>${trialEndsAt}</strong>.</p><p>Daily broadcast limits: <strong>50 messages/day</strong>.</p><p>Login to workspace: <a href="${loginUrl}">${loginUrl}</a></p><p>Best,<br/>SyncWA Team</p>`;
        break;

      case "onboarding_reminder":
        subject = `Complete Your SyncWA Setup`;
        bodyText = `Hello ${customerName},\n\nFinish setting up your SyncWA workspace to unlock broadcast marketing. Steps remaining: connect WhatsApp and import contacts.\n\nLogin here: ${loginUrl}\n\nBest,\nSyncWA Team`;
        bodyHtml = `<p>Hello <strong>${customerName}</strong>,</p><p>Finish setting up your SyncWA workspace to unlock broadcast marketing. Steps remaining: connect WhatsApp and import contacts.</p><p>Login here: <a href="${loginUrl}">${loginUrl}</a></p><p>Best,<br/>SyncWA Team</p>`;
        break;

      case "trial_expiring":
        subject = `Urgent: Your SyncWA Trial is Expiring Soon`;
        bodyText = `Hello ${customerName},\n\nYour free trial ends on ${trialEndsAt} (in less than 3 days). Upgrading to a paid subscription ensures uninterrupted access to broadcasts.\n\nBest,\nSyncWA Team`;
        bodyHtml = `<p>Hello <strong>${customerName}</strong>,</p><p>Your free trial ends on <strong>${trialEndsAt}</strong> (in less than 3 days). Upgrading to a paid subscription ensures uninterrupted access to broadcasts.</p><p>Best,<br/>SyncWA Team</p>`;
        break;

      case "trial_expired":
        subject = `SyncWA Free Trial Expired`;
        bodyText = `Hello ${customerName},\n\nYour free trial period has expired. Access to your workspace is currently suspended. Upgrade to a paid plan to reactivate access instantly.\n\nBest,\nSyncWA Team`;
        bodyHtml = `<p>Hello <strong>${customerName}</strong>,</p><p>Your free trial period has expired. Access to your workspace is currently suspended. Upgrade to a paid plan to reactivate access instantly.</p><p>Best,<br/>SyncWA Team</p>`;
        break;

      case "onboarding_completed":
        subject = `Congratulations! SyncWA Onboarding Complete`;
        bodyText = `Hello ${customerName},\n\nAwesome work! You have completed all 7 onboarding steps. Your workspace is now fully activated!\n\nBest,\nSyncWA Team`;
        bodyHtml = `<p>Hello <strong>${customerName}</strong>,</p><p>Awesome work! You have completed all 7 onboarding steps. Your workspace is now fully activated!</p><p>Best,<br/>SyncWA Team</p>`;
        break;

      default:
        subject = `Notification from SyncWA`;
        bodyText = `Hello ${customerName},\n\nThis is a lifecycle notification from SyncWA.\n\nBest,\nSyncWA Team`;
        bodyHtml = `<p>Hello <strong>${customerName}</strong>,</p><p>This is a lifecycle notification from SyncWA.</p><p>Best,<br/>SyncWA Team</p>`;
        break;
    }

    return { subject, bodyText, bodyHtml };
  }
}
