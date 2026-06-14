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
            const sessionResponse = await fetch(PAYPORT_INDEX_URL, {
                method: "GET",
                headers: payportHeaders()
            });
            const cookie = getCookieHeader(sessionResponse.headers.get("set-cookie"));

            const response = await fetch(payportUrl.toString(), {
                method: "GET",
                headers: payportHeaders(cookie)
            });

            const text = await response.text();

            if (!response.ok) {
                return json(
                    {
                        error: true,
                        message: "PayPort returned error",
                        status: response.status,
                        body: text
                    },
                    502,
                    request
                );
            }

            let data;

            try {
                data = JSON.parse(text);
            } catch (parseError) {
                return json(
                    {
                        error: true,
                        message: "Invalid JSON returned from PayPort",
                        body: text
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
        "Referer": PAYPORT_INDEX_URL,
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

function getTodayPayportDate() {
    return new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).replace(/ /g, "-");
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
