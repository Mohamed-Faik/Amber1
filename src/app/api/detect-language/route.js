import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get client IP from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";

    // Try multiple IP geolocation services
    const services = [
      `https://ipapi.co/${ip}/json/`,
      `https://ip-api.com/json/${ip}?fields=countryCode`,
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
          let countryCode = null;

          // Handle different API response formats
          if (data.country_code) {
            countryCode = data.country_code;
          } else if (data.countryCode) {
            countryCode = data.countryCode;
          }

          if (countryCode) {
            // Map country codes to languages
            if (countryCode === "FR") {
              return NextResponse.json({ language: "fr", country: countryCode });
            } else if (countryCode === "US") {
              return NextResponse.json({ language: "en", country: countryCode });
            } else if (countryCode === "BE") {
              return NextResponse.json({ language: "nl", country: countryCode });
            } else {
              return NextResponse.json({ language: "en", country: countryCode });
            }
          }
        }
      } catch (error) {
        // Try next service
        continue;
      }
    }

    // All services failed, default to English
    return NextResponse.json({ language: "en", country: "unknown" });
  } catch (error) {
    // Default to English on any error
    return NextResponse.json({ language: "en", country: "unknown" });
  }
}

