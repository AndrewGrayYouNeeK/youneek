import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const WIX_API_KEY = Deno.env.get('WIX_PAYMENTS_API_KEY');
const WIX_SITE_ID = Deno.env.get('WIX_PAYMENTS_SITE_ID');

Deno.serve(async (req) => {
  try {
    // Initialize for potential future use/logging (no auth required for public checkout)
    createClientFromRequest(req);

    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const origin = req.headers.get('origin');
    if (!origin) {
      console.warn('Missing Origin header; falling back to req.url origin');
    }
    const baseUrl = origin || new URL(req.url).origin;

    const { amount, itemName = 'Donation', quantity = 1 } = await req.json();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!WIX_API_KEY || !WIX_SITE_ID) {
      console.error('Missing Wix Payments env vars');
      return Response.json({ error: 'Payments not configured' }, { status: 500 });
    }

    const price = Number(amount).toFixed(2); // USD string

    const body = {
      cart: {
        items: [
          { name: String(itemName).slice(0, 255), quantity: Number(quantity) || 1, price },
        ],
      },
      callbackUrls: {
        postFlowUrl: `${baseUrl}`,
        thankYouPageUrl: `${baseUrl}/ThankYou`,
      },
    };

    const wixRes = await fetch('https://www.wixapis.com/payments/platform/v1/checkout-sessions/construct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': WIX_API_KEY,
        'wix-site-id': WIX_SITE_ID,
      },
      body: JSON.stringify(body),
    });

    const data = await wixRes.json();

    if (!wixRes.ok) {
      console.error('Wix create checkout failed', { status: wixRes.status, data });
      return Response.json({ error: data?.message || 'Checkout error', details: data }, { status: wixRes.status });
    }

    const redirectUrl = data?.checkoutSession?.redirectUrl;
    const id = data?.checkoutSession?.id;

    return Response.json({ redirectUrl, id });
  } catch (err) {
    console.error('create-checkout error', err?.message || err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
});