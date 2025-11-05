/**
 * Mock Twilio API Client
 * Simulates WhatsApp message sending via Twilio API
 */

export interface WhatsAppMessage {
  to: string;
  body: string;
  mediaUrl?: string;
}

export interface WhatsAppResponse {
  sid: string;
  status: string;
  to: string;
  dateSent: Date;
}

export class TwilioApiMock {
  /**
   * Sends a WhatsApp message (mocked)
   */
  async sendWhatsAppMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log(`[MOCK TWILIO] Sending WhatsApp to ${message.to}`);
    console.log(`[MOCK TWILIO] Message: ${message.body}`);

    return {
      sid: `SM${Math.random().toString(36).substring(2, 15)}`,
      status: 'sent',
      to: message.to,
      dateSent: new Date(),
    };
  }

  /**
   * Sends daily summary to a list of WhatsApp numbers
   */
  async sendDailySummary(phoneNumbers: string[], summary: string, dashboardUrl: string): Promise<WhatsAppResponse[]> {
    const messages: Promise<WhatsAppResponse>[] = phoneNumbers.map(phone => {
      const body = `🧠 OmniAds Daily Summary\n\n${summary}\n\n📊 View full dashboard: ${dashboardUrl}`;
      return this.sendWhatsAppMessage({ to: phone, body });
    });

    return Promise.all(messages);
  }
}
