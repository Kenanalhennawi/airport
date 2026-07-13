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

        return json(
            {
                error: false,
                live: false,
                source: "IATA Travel Centre / Timatic",
                message: "Official Timatic live requirements require IATA API credentials. Use the official IATA Travel Centre link to verify the passenger details.",
                query,
                result: {
                    status: "verification_required",
                    action: "Open IATA Travel Centre and enter the same route, nationality, residence, and passport type.",
                    warnings: [
                        "Travel requirements can change without prior notice.",
                        "Final acceptance remains subject to airport, immigration, and destination authority decision.",
                        "This endpoint is API-ready and should be connected to official Timatic credentials when available."
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
