import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get client IP from headers (for Vercel/proxied requests)
    // x-forwarded-for contains the original client IP when behind a proxy
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare
    
    // Extract the first IP from x-forwarded-for (client IP is usually first)
    const ip = forwarded 
      ? forwarded.split(",")[0].trim() 
      : (realIp || cfConnectingIp || null);
    
    // Log for debugging
    console.log("[Language Detection] IP Headers:", {
      "x-forwarded-for": forwarded,
      "x-real-ip": realIp,
      "cf-connecting-ip": cfConnectingIp,
      "extracted-ip": ip
    });

    // Try multiple IP geolocation services
    // If we have the client IP from headers, use it explicitly
    // Otherwise, services will auto-detect (but may detect server IP)
    const services = ip
      ? [
          // Use explicit IP when available (more reliable)
          { 
            url: `https://ipapi.co/${ip}/json/`, 
            getCountry: (data) => data.country_code,
            name: "ipapi.co (with IP)"
          },
          { 
            url: `https://ip-api.com/json/${ip}?fields=countryCode`, 
            getCountry: (data) => data.countryCode,
            name: "ip-api.com (with IP)"
          },
        ]
      : [
          // Auto-detect (may detect server IP, but worth trying)
          { 
            url: "https://ipapi.co/json/", 
            getCountry: (data) => data.country_code,
            name: "ipapi.co (auto)"
          },
          { 
            url: "https://ip-api.com/json/?fields=countryCode", 
            getCountry: (data) => data.countryCode,
            name: "ip-api.com (auto)"
          },
        ];

    for (const service of services) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(service.url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          
          // Handle ipify service (just gets IP, need to query again)
          if (service.name === "ipify" && data.ip) {
            // Use the detected IP with ipapi.co
            try {
              const ipResponse = await fetch(`https://ipapi.co/${data.ip}/json/`, {
                headers: { Accept: "application/json" },
              });
              if (ipResponse.ok) {
                const ipData = await ipResponse.json();
                const countryCode = ipData.country_code;
                if (countryCode) {
                  let language = "en";
                  if (countryCode === "FR") language = "fr";
                  else if (countryCode === "US") language = "en";
                  else if (countryCode === "BE") language = "nl";
                  
                  console.log(`[Language Detection] ✅ Detected via ipify: ${language} for country: ${countryCode}`);
                  return NextResponse.json({ language, country: countryCode, ip: data.ip, service: "ipify+ipapi" });
                }
              }
            } catch (e) {
              continue;
            }
          } else {
            const countryCode = service.getCountry ? service.getCountry(data) : null;

            // Debug logging - show full response
            console.log(`[Language Detection] Service: ${service.name}`);
            console.log(`[Language Detection] Full Response Data:`, JSON.stringify(data, null, 2));
            console.log(`[Language Detection] Extracted Country Code: ${countryCode}`);

            if (countryCode) {
              // Map country codes to languages
              let language = "en";
              if (countryCode === "FR") {
                language = "fr";
              } else if (countryCode === "US") {
                language = "en";
              } else if (countryCode === "BE") {
                language = "nl";
              }

              console.log(`[Language Detection] ✅ SUCCESS - Setting language to: ${language} for country: ${countryCode} using ${service.name}`);
              return NextResponse.json({ 
                language, 
                country: countryCode, 
                ip: ip || data.ip || "auto-detected",
                service: service.name,
                debug: { rawData: data }
              });
            } else {
              console.log(`[Language Detection] ⚠️ No country code found in response from ${service.name}`);
            }
          }
        } else {
          const errorText = await response.text().catch(() => "");
          console.log(`[Language Detection] ❌ Service ${service.name} returned status: ${response.status}, Error: ${errorText.substring(0, 200)}`);
        }
      } catch (error) {
        console.log(`[Language Detection] Service ${service.name} failed:`, error.message);
        // Try next service
        continue;
      }
    }

    // All services failed, default to English
    console.log("[Language Detection] All services failed, defaulting to English");
    return NextResponse.json({ language: "en", country: "unknown", ip: ip || "unknown" });
  } catch (error) {
    // Default to English on any error
    console.error("[Language Detection] Error:", error);
    return NextResponse.json({ language: "en", country: "error", error: error.message });
  }
}

