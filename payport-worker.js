export default {
  async fetch(request) {
    const requestUrl = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders()
      });
    }

    if (requestUrl.pathname === "/") {
      return json({
        status: "ok",
        service: "PayPort Cloudflare Proxy"
      });
    }

    if (requestUrl.pathname !== "/api/convert") {
      return json({ error: true, message: "Not found" }, 404);
    }

    const amount = requestUrl.searchParams.get("amount") || "10.00";
    const from = requestUrl.searchParams.get("from") || "United States Dollar (USD)";
    const to = requestUrl.searchParams.get("to") || "United Arab Emirates Dirham (AED)";
    const period = requestUrl.searchParams.get("period") || "07-Jun-2026";

    const payportUrl = new URL("https://payport.flydubai.com/en/CurrencyConverter/CurrencyCoverterCalculate");

    payportUrl.searchParams.set("sourceCurrencyAmount", amount);
    payportUrl.searchParams.set("sourceCurrencyCode", from);
    payportUrl.searchParams.set("targetCurrencyCode", to);
    payportUrl.searchParams.set("period", period);
    payportUrl.searchParams.set("_", Date.now().toString());

    try {
      const response = await fetch(payportUrl.toString(), {
  method: "GET",
  headers: {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Referer": "https://payport.flydubai.com/en/CurrencyConverter/Index",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest"
  }
});

      const text = await response.text();

      if (!response.ok) {
        return json({
          error: true,
          message: "PayPort returned error",
          status: response.status,
          body: text
        }, 502);
      }

      const data = JSON.parse(text);

      return json({
        error: false,
        source: "Flydubai PayPort",
        amount,
        from,
        to,
        period,
        targetValue: data.TargetValue,
        rate: data.rate,
        raw: data
      });
    } catch (error) {
      return json({
        error: true,
        message: error.message
      }, 500);
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders()
    }
  });
}
