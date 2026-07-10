const PI_BASE = 'https://api.minepi.com';

function piHeaders(apiKey) {
  return {
    'Authorization': `Key ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export default {
  async fetch(request, env) {
    const PI_API_KEY = env.PI_API_KEY;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    const url = new URL(request.url);

    // /health
    if (url.pathname === '/health') {
      return jsonResponse({ status: 'ok', worker: 'sabrtime-pi', version: '4.0' });
    }

    // /complete-with-id — GET endpoint to complete stuck payment
    // Usage: /complete-with-id?paymentId=XXX&txid=YYY
    if (url.pathname === '/complete-with-id') {
      try {
        const paymentId = url.searchParams.get('paymentId');
        const txid = url.searchParams.get('txid');

        if (!paymentId || !txid) {
          return jsonResponse({ error: 'paymentId and txid params required' }, 400);
        }

        console.log('[Worker] Completing stuck payment:', paymentId, txid);

        const res = await fetch(`${PI_BASE}/v2/payments/${paymentId}/complete`, {
          method: 'POST',
          headers: piHeaders(PI_API_KEY),
          body: JSON.stringify({ txid }),
        });

        const data = await res.json();
        console.log('[Worker] Complete result:', JSON.stringify(data));

        return jsonResponse({
          status: res.status === 200 ? 'SUCCESS ✅' : 'failed',
          paymentId,
          txid,
          result: data
        }, res.status);

      } catch (e) {
        console.error('[Worker] /complete-with-id error:', e.message);
        return jsonResponse({ error: e.message }, 500);
      }
    }

    // /approve
    if (url.pathname === '/approve' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { paymentId } = body;
        if (!paymentId) return jsonResponse({ error: 'paymentId required' }, 400);
        console.log('[Worker] Approving:', paymentId);
        const res = await fetch(`${PI_BASE}/v2/payments/${paymentId}/approve`, {
          method: 'POST',
          headers: piHeaders(PI_API_KEY),
        });
        const data = await res.json();
        console.log('[Worker] Approve:', JSON.stringify(data));
        return jsonResponse(data, res.status);
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }

    // /complete
    if (url.pathname === '/complete' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { paymentId, txid } = body;
        if (!paymentId || !txid) return jsonResponse({ error: 'paymentId and txid required' }, 400);
        console.log('[Worker] Completing:', paymentId, txid);
        const res = await fetch(`${PI_BASE}/v2/payments/${paymentId}/complete`, {
          method: 'POST',
          headers: piHeaders(PI_API_KEY),
          body: JSON.stringify({ txid }),
        });
        const data = await res.json();
        console.log('[Worker] Complete:', JSON.stringify(data));
        return jsonResponse(data, res.status);
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }

    // /cancel
    if (url.pathname === '/cancel' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { paymentId } = body;
        if (!paymentId) return jsonResponse({ error: 'paymentId required' }, 400);
        console.log('[Worker] Cancelling:', paymentId);
        const res = await fetch(`${PI_BASE}/v2/payments/${paymentId}/cancel`, {
          method: 'POST',
          headers: piHeaders(PI_API_KEY),
        });
        const data = await res.json();
        console.log('[Worker] Cancel:', JSON.stringify(data));
        return jsonResponse(data, res.status);
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }

    return jsonResponse({ error: 'Not found' }, 404);
  }
};
