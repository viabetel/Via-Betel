export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag("event", eventName, properties)
    }

    // Meta Pixel
    if (window.fbq) {
      window.fbq("track", eventName, properties)
    }

    console.log("[v0] Analytics event:", eventName, properties)
  }
}

// Eventos específicos
export const analytics = {
  clickWhatsApp: (source: string) => {
    trackEvent("click_whatsapp", { source })
  },
  leadSubmitSuccess: (leadData: { categoria?: string; objetivo?: string }) => {
    trackEvent("lead_submit_success", leadData)
  },
  leadSubmitError: (error: string) => {
    trackEvent("lead_submit_error", { error })
  },
}

// Tipos para TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
  }
}
