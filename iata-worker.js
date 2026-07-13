const allowedOrigins = [
    "https://kenanalhennawi.github.io"
];

const IATA_TRAVEL_CENTRE_URL = "https://www.iatatravelcentre.com/";

export default {
    async fetch(request) {
        const requestUrl = new URL(request.url);
        const origin = request.headers.get("Origin") || "";

        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders(request)
            });
        }

        if (!allowedOrigins.includes(origin)) {
            return json(
                {
                    error: true,
                    message: "Origin not allowed"
                },
                403,
                request
            );
        }

        if (request.method !== "GET") {
            return json(
                {
                    error: true,
                    message: "Method not allowed"
                },
                405,
                request
            );
        }

        if (requestUrl.pathname === "/") {
            return json(
                {
                    status: "ok",
                    service: "IATA Travel Centre Requirements Proxy",
                    version: "1.0"
                },
                200,
                request
            );
        }

        if (requestUrl.pathname !== "/api/iata/requirements") {
            return json(
                {
                    error: true,
                    message: "Not found"
                },
                404,
                request
            );
        }

        const query = {
            from: clean(requestUrl.searchParams.get("from")),
            to: clean(requestUrl.searchParams.get("to")),
            nationality: clean(requestUrl.searchParams.get("nationality")),
            residence: clean(requestUrl.searchParams.get("residence")),
            passportType: clean(requestUrl.searchParams.get("passportType") || "ordinary")
        };

        if (!query.from || !query.to || !query.nationality) {
            return json(
                {
                    error: true,
                    message: "Missing required parameters",
                    required: ["from", "to", "nationality"]
                },
                400,
                request
            );
        }

        const portalStatus = await checkIataPortalStatus();

        return json(
            {
                error: false,
                source: "IATA Travel Centre",
                message: "Route prepared. Open the official IATA Travel Centre to verify current travel requirements.",
                query,
                result: {
                    status: "official_verification_required",
                    portalAvailable: portalStatus.available,
                    portalStatus: portalStatus.status,
                    action: "Use the official IATA Travel Centre with the same route, nationality, residence, and passport type.",
                    warnings: [
                        "Travel requirements can change without prior notice.",
                        "Final acceptance remains subject to airport, immigration, and destination authority decision."
                    ]
                },
                officialUrl: IATA_TRAVEL_CENTRE_URL
            },
            200,
            request
        );
    }
};

function clean(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
}

async function checkIataPortalStatus() {
    try {
        const response = await fetch(IATA_TRAVEL_CENTRE_URL, {
            method: "GET",
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
            }
        });

        return {
            available: response.ok,
            status: response.status
        };
    } catch (error) {
        return {
            available: false,
            status: "unreachable"
        };
    }
}

function corsHeaders(request) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0];

    return {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin"
    };
}

function json(data, status = 200, request) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            ...corsHeaders(request)
        }
    });
}
