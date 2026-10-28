export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/generate") {
      const key = "FREE_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);
      await env.COFFEE_KEYS.put(key, "valid", { expirationTtl: 86400 });
      
      return new Response(`
        <html>
          <body style="background:#0f0f12; color:white; font-family:sans-serif; text-align:center; padding:50px;">
            <h1 style="color:#8a2be2;">CoffeeUniv ☕</h1>
            <p>Cheia ta valabilă 24h:</p>
            <h2 style="background:#25252d; padding:15px; border-radius:5px; border:1px solid #8a2be2;">${key}</h2>
            <p>Copiază cheia și pune-o în script!</p>
          </body>
        </html>
      `, { headers: { "content-type": "text/html" } });
    }

    if (url.pathname === "/verify") {
      const keyToCheck = url.searchParams.get("key");
      if (!keyToCheck) return new Response("Lipseste cheia", { status: 400 });
      const value = await env.COFFEE_KEYS.get(keyToCheck);
      return value === "valid" ? new Response("Valid", { status: 200 }) : new Response("Invalid", { status: 401 });
    }

    return new Response("Coffee API Running", { status: 200 });
  },
};
