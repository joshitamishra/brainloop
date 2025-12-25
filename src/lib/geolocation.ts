// src/lib/geolocation.ts
// Utility functions for IP geolocation

export function getClientIP(req: Request): string {
    // Try various headers that might contain the real IP
    const forwarded = req.headers.get("x-forwarded-for");
    const realIP = req.headers.get("x-real-ip");
    const cfConnectingIP = req.headers.get("cf-connecting-ip"); // Cloudflare
    
    if (forwarded) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwarded.split(",")[0].trim();
    }
    
    if (realIP) {
        return realIP;
    }
    
    if (cfConnectingIP) {
        return cfConnectingIP;
    }
    
    return "unknown";
}

export async function getLocationFromIP(ip: string): Promise<string> {
    // Skip geolocation for localhost/private IPs
    if (ip === "unknown" || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.") || ip === "::1") {
        return "Local";
    }
    
    try {
        // Using ip-api.com (free, no API key required for basic usage)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`);
        const data = await response.json();
        
        if (data.status === "success") {
            const parts = [data.city, data.regionName, data.country].filter(Boolean);
            return parts.join(", ") || "Unknown";
        }
        
        return "Unknown";
    } catch (error) {
        console.error("Geolocation error:", error);
        return "Unknown";
    }
}

export function getUserAgent(req: Request): string {
    return req.headers.get("user-agent") || "Unknown";
}

