// ══════════════════════════════════════════════
// SabrTime Pi Payment Worker
// Cloudflare Worker — sabrtime-pi
// ══════════════════════════════════════════════
// Secrets required in Cloudflare:
//   PI_API_KEY  → Pi Developer Portal API key
//   APP_SECRET  → Any secret string (must match WORKER_SECRET in index.html)
// ══════════════════════════════════════════════

const PI_BASE = 'https://api.minepi.com';

// ── Helper functions (defined OUTSIDE fetch handler) ──
function piHeaders(apiKey) {
  return {
    'Authorization': `Key ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

function jsonResponse(body, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

function getCorsHeaders(origin) {
  const allowed = ['https://sabrtime.in', 'https://kyunus175.github.io'];
  const corsOrigin = allowed.includes(origin) ? origin : 'https://sabrtime.in';
  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-App-Secret',
    'Access-Control-Max-Age': '86400',
  };
}

// ── Main Worker ──
export default {
  async fetch(request, env) {

    const PI_API_KEY = env.PI_API_KEY;
    const APP_SECRET = env.APP_SECRET;
    const origin = request.headers.get('Origin') || '';
    const CORS = getCorsHeaders(origin);

    // ── CORS preflight ──
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: CORS });
    }

    const url = new URL(request.url);

    // ── /health — Public, no auth needed ──
    if (url.pathname === '/health') {
      return jsonResponse({ status: 'ok', worker: 'sabrtime-pi', time: new Date().toISOString() }, 200, CORS);
    }

    // ══════════════════════════════════════════
    // SECURITY — All endpoints below need secret
    // ══════════════════════════════════════════
    const clientSecret = request.headers.get('X-App-Secret');
    if (!PI_API_KEY) {
      console.error('[SabrTime Worker] PI_API_KEY not configured!');
      return jsonResponse({ error: 'Worker misconfigured' }, 500, CORS);
    }
    if (!APP_SECRET || clientSecret !== APP_SECRET) {
      console.error('[SabrTime Worker] Unauthorized — invalid X-App-Secret for:', url.pathname);
      return jsonResponse({ error: 'Unauthorized' }, 401, CORS);
    }

    // ══════════════════════════════════════════
    // /approve — Phase 1: Approve payment
    // Called from onReadyForServerApproval
    // ══════════════════════════════════════════
    if (url.pathname === '/approve' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { paymentId } = body;

        if (!paymentId) {
          return jsonResponse({ error: 'paymentId is required' }, 400, CORS);
        }

        console.log('[SabrTime Worker] Approving payment:', paymentId);

        const res = await fetch(`${PI_BASE}/v2/payments/${paymentId}/approve`, {
          method: 'POST',
          headers: piHeaders(PI_API_KEY),
        });

        const data = await res.json();
        console.log('[SabrTime Worker] Approve response:', JSON.stringify(data));
        return jsonResponse(data, res.status, CORS);

      } catch (e) {
        console.error('[SabrTime Worker] /approve error:', e.message);
        return jsonResponse({ error: e.message }, 500, CORS);
      }
    }

    // ══════════════════════════════════════════
    // /complete — Phase 2: Complete payment
    // Called from onReadyForServerCompletion
    // ══════════════════════════════════════════
    if (url.pathname === '/complete' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { paymentId, txid } = body;

        if (!paymentId || !txid) {
          console.error('[SabrTime Worker] /complete missing params:', { paymentId, txid });
          return jsonResponse({ error: 'paymentId and txid are required' }, 400, CORS);
        }

        console.log('[SabrTime Worker] Completing payment:', paymentId, '| txid:', txid);

        const res = await fetch(`${PI_BASE}/v2/payments/${paymentId}/complete`, {
          method: 'POST',
          headers: piHeaders(PI_API_KEY),
          body: JSON.stringify({ txid }),
        });

        const data = await res.json();
        console.log('[SabrTime Worker] Complete response:', JSON.stringify(data));
        return jsonResponse(data, res.status, CORS);

      } catch (e) {
        console.error('[SabrTime Worker] /complete error:', e.message);
        return jsonResponse({ error: e.message }, 500, CORS);
      }
    }

    // ══════════════════════════════════════════
    // /cancel — Cancel stuck/incomplete payment
    // Called from onIncompletePaymentFound
    // ══════════════════════════════════════════
    if (url.pathname === '/cancel' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { paymentId } = body;

        if (!paymentId) {
          return jsonResponse({ error: 'paymentId is required' }, 400, CORS);
        }

        console.log('[SabrTime Worker] Cancelling payment:', paymentId);

        const res = await fetch(`${PI_BASE}/v2/payments/${paymentId}/cancel`, {
          method: 'POST',
          headers: piHeaders(PI_API_KEY),
        });

        const data = await res.json();
        console.log('[SabrTime Worker] Cancel response:', JSON.stringify(data));
        return jsonResponse(data, res.status, CORS);

      } catch (e) {
        console.error('[SabrTime Worker] /cancel error:', e.message);
        return jsonResponse({ error: e.message }, 500, CORS);
      }
    }

    // ══════════════════════════════════════════
    // /get-incomplete — List incomplete payments
    // Safe by default — auto_cancel=true to cancel
    // ══════════════════════════════════════════
    if (url.pathname === '/get-incomplete' && request.method === 'GET') {
      try {
        const shouldAutoCancel = url.searchParams.get('auto_cancel') === 'true';
        console.log('[SabrTime Worker] get-incomplete | auto_cancel:', shouldAutoCancel);

        const res = await fetch(`${PI_BASE}/v2/payments?payment_type=developer_approved`, {
          method: 'GET',
          headers: piHeaders(PI_API_KEY),
        });

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('[SabrTime Worker] Pi API non-JSON response:', text.substring(0, 200));
          return jsonResponse({ error: 'Pi API returned non-JSON', raw: text.substring(0, 200) }, 502, CORS);
        }

        const payments = data?.data || data?.payments || [];
        console.log('[SabrTime Worker] Incomplete payments found:', payments.length);

        // Safe mode — just list
        if (!shouldAutoCancel) {
          return jsonResponse({ status: 'fetched', count: payments.length, payments }, 200, CORS);
        }

        // Auto-cancel mode — use with caution!
        console.warn('[SabrTime Worker] Auto-cancelling', payments.length, 'payments');

        const results = await Promise.all(
          payments.map(async (payment) => {
            const pid = payment.identifier || payment.paymentId;
            if (!pid) return { id: null, status: 'skipped' };
            try {
              const cancelRes = await fetch(`${PI_BASE}/v2/payments/${pid}/cancel`, {
                method: 'POST',
                headers: piHeaders(PI_API_KEY),
              });
              const cancelData = await cancelRes.json();
              console.log('[SabrTime Worker] Auto-cancelled:', pid);
              return { id: pid, status: 'cancelled', response: cancelData };
            } catch (ce) {
              console.error('[SabrTime Worker] Auto-cancel failed:', pid, ce.message);
              return { id: pid, status: 'error', error: ce.message };
            }
          })
        );

        return jsonResponse({ status: 'auto_cancelled', found: payments.length, results }, 200, CORS);

      } catch (e) {
        console.error('[SabrTime Worker] /get-incomplete error:', e.message);
        return jsonResponse({ error: e.message }, 500, CORS);
      }
    }

    // ── 404 ──
    return jsonResponse({ error: 'Endpoint not found' }, 404, CORS);
  }
};
