// Detect user's language based on IP address geolocation
// Uses server-side API route first, falls back to client-side if needed
export const detectUserLanguage = async () => {
  // Only use IP-based detection in browser
  if (typeof window === "undefined") {
    return "en";
  }

  // Try server-side API route first
  try {
    const response = await fetch("/api/detect-language", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Always fetch fresh to detect current IP
    });

    if (response.ok) {
      const data = await response.json();
      const detectedLang = data.language || "en";
      console.log("[Client] Language detected via API:", detectedLang, "Country:", data.country, "IP:", data.ip, "Service:", data.service);
      
      // If we got a valid detection (not "unknown"), use it
      if (data.country && data.country !== "unknown") {
        return detectedLang;
      }
    }
  } catch (error) {
    console.log("[Client] API route failed, trying client-side detection:", error.message);
  }

  // Fallback: Try client-side detection (works better for VPN/local testing)
  // Some services support CORS for basic detection
  try {
    const services = [
      "https://api.country.is/",
      "https://ipapi.co/json/",
    ];

    for (const serviceUrl of services) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(serviceUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          let countryCode = data.country || data.country_code || data.countryCode;

          console.log("[Client] Client-side detection result:", { serviceUrl, countryCode, data });

          if (countryCode) {
            let language = "en";
            if (countryCode === "FR") language = "fr";
            else if (countryCode === "US") language = "en";
            else if (countryCode === "BE") language = "nl";

            console.log("[Client] ✅ Client-side detection successful:", language, "for country:", countryCode);
            return language;
          }
        }
      } catch (error) {
        console.log("[Client] Service failed:", serviceUrl, error.message);
        continue;
      }
    }
  } catch (error) {
    console.error("[Client] Client-side detection error:", error);
  }

  // Default to English if all detection fails
  console.log("[Client] All detection methods failed, defaulting to English");
  return "en";
};
