// Detect user's language based on IP address geolocation
// Uses server-side API route to avoid CORS and fetch errors
export const detectUserLanguage = async () => {
  // Only use IP-based detection in browser
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    // Use our own API route to avoid CORS issues
    const response = await fetch("/api/detect-language", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.language || "en";
    }
  } catch (error) {
    // Silently fail and return default
  }

  // Default to English if detection fails
  return "en";
};

