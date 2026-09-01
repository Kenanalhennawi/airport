const allowedOrigins = [
    "https://kenanalhennawi.github.io"
];

const PAYPORT_INDEX_URL = "https://payport.flydubai.com/en/CurrencyConverter/Index";
const PAYPORT_CALCULATE_URL = "https://payport.flydubai.com/en/CurrencyConverter/CurrencyCoverterCalculate";

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
                    service: "PayPort Cloudflare Proxy",
                    version: "1.1"
                },
                200,
                request
            );
        }

        if (requestUrl.pathname !== "/api/convert") {
            return json(
                {
                    error: true,
                    message: "Not found"
                },
                404,
                request
            );
        }

        const amount = requestUrl.searchParams.get("amount") || "10.00";
        const from = requestUrl.searchParams.get("from") || "United States Dollar (USD)";
        const to = requestUrl.searchParams.get("to") || "United Arab Emirates Dirham (AED)";
        const period = requestUrl.searchParams.get("period") || getTodayPayportDate();

        if (!isValidAmount(amount)) {
            return json(
                {
                    error: true,
                    message: "Invalid amount"
                },
                400,
                request
            );
        }

        if (!from || !to || !period) {
            return json(
                {
                    error: true,
                    message: "Missing required parameters"
                },
                400,
                request
            );
        }

        const payportUrl = new URL(PAYPORT_CALCULATE_URL);

        payportUrl.searchParams.set("sourceCurrencyAmount", amount);
        payportUrl.searchParams.set("sourceCurrencyCode", from);
        payportUrl.searchParams.set("targetCurrencyCode", to);
        payportUrl.searchParams.set("period", period);
        payportUrl.searchParams.set("_", Date.now().toString());

        try {
            let data = null;
            let lastStatus = 502;
            let cookie = "";

            for (let attempt = 1; attempt <= 3; attempt += 1) {
                const sessionUrl = new URL(PAYPORT_INDEX_URL);
                sessionUrl.searchParams.set("_", `${Date.now()}-${attempt}`);
                payportUrl.searchParams.set("_", `${Date.now()}-${attempt}`);

                const sessionResponse = await fetch(sessionUrl.toString(), {
                    method: "GET",
                    headers: payportHeaders(cookie)
                });
                cookie = mergeCookieHeaders(
                    cookie,
                    getCookieHeader(sessionResponse.headers.get("set-cookie"))
                );

                const response = await fetch(payportUrl.toString(), {
                    method: "GET",
                    headers: payportHeaders(cookie)
                });
                const text = await response.text();
                lastStatus = response.status;
                cookie = mergeCookieHeaders(
                    cookie,
                    getCookieHeader(response.headers.get("set-cookie"))
                );

                if (!response.ok) continue;

                try {
                    data = JSON.parse(text);
                    break;
                } catch (parseError) {
                    // Preserve Akamai cookies and retry the same session.
                }
            }

            if (!data) {
                return json(
                    {
                        error: true,
                        message: "Invalid JSON returned from PayPort",
                        status: lastStatus
                    },
                    502,
                    request
                );
            }

            const targetValue = data.TargetValue || data.AedValue || data.UsdValue || data.EurValue || data.GbpValue || null;
            const rate = data.rate || data.Rate || calculateRate(targetValue, amount);

            return json(
                {
                    error: false,
                    source: "Flydubai PayPort",
                    amount,
                    from,
                    to,
                    period,
                    targetValue,
                    rate,
                    raw: data
                },
                200,
                request
            );
        } catch (error) {
            return json(
                {
                    error: true,
                    message: error.message || "Proxy error"
                },
                500,
                request
            );
        }
    }
};

function isValidAmount(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 && n <= 1000000;
}

function payportHeaders(cookie) {
    const headers = {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Origin": "https://payport.flydubai.com",
        "Referer": PAYPORT_INDEX_URL,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest"
    };

    if (cookie) headers.Cookie = cookie;
    return headers;
}

function getCookieHeader(setCookie) {
    if (!setCookie) return "";
    return setCookie
        .split(/,(?=\s*[^;=]+=[^;]+)/)
        .map((item) => item.split(";")[0].trim())
        .filter(Boolean)
        .join("; ");
}

function mergeCookieHeaders(current, incoming) {
    const cookies = new Map();

    [current, incoming].forEach((header) => {
        String(header || "").split(";").forEach((part) => {
            const separator = part.indexOf("=");
            if (separator <= 0) return;
            const name = part.slice(0, separator).trim();
            const value = part.slice(separator + 1).trim();
            if (name) cookies.set(name, value);
        });
    });

    return Array.from(cookies, ([name, value]) => `${name}=${value}`).join("; ");
}

function getTodayPayportDate() {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dubai",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).formatToParts(new Date());
    const values = Object.fromEntries(
        parts.map(({ type, value }) => [type, value])
    );

    return `${values.day}-${months[Number(values.month) - 1]}-${values.year}`;
}

function parsePayportNumber(value) {
    const n = Number(String(value || "").replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
}

function calculateRate(targetValue, amount) {
    const target = parsePayportNumber(targetValue);
    const source = parsePayportNumber(amount);
    if (!target || !source) return null;
    return (target / source).toFixed(5);
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
