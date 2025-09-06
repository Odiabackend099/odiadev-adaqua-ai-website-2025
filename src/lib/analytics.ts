// Analytics tracking for ODIADEV
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    // Check if analytics is enabled (respect user privacy)
    this.isEnabled = localStorage.getItem('analytics_enabled') !== 'false';
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);
    console.log('Analytics Event:', analyticsEvent);

    // In production, send to your analytics service
    // this.sendToAnalyticsService(analyticsEvent);
  }

  // Voice-specific events
  trackVoiceToggle(enabled: boolean) {
    this.track('voice_toggle', { enabled });
  }

  trackPersonaChange(persona: string) {
    this.track('persona_change', { persona });
  }

  trackChatMessage(messageLength: number, hasVoice: boolean) {
    this.track('chat_message', { 
      messageLength, 
      hasVoice,
      timestamp: Date.now()
    });
  }

  trackTTSRequest(persona: string, textLength: number, success: boolean) {
    this.track('tts_request', { 
      persona, 
      textLength, 
      success,
      timestamp: Date.now()
    });
  }

  trackPageView(page: string) {
    this.track('page_view', { page });
  }

  trackUserSignup(method: string) {
    this.track('user_signup', { method });
  }

  trackUserLogin(method: string) {
    this.track('user_login', { method });
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('analytics_enabled', enabled.toString());
  }

  // Get analytics data (for dashboard)
  getEvents() {
    return this.events;
  }

  // Clear analytics data
  clearEvents() {
    this.events = [];
  }

  // Private method to send to analytics service
  private async sendToAnalyticsService(event: AnalyticsEvent) {
    try {
      // Replace with your analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }
}

export const analytics = new Analytics();
