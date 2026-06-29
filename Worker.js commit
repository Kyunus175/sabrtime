export default {
  async fetch(request, env) {
    try {
      const b = await request.json()
      const res = await fetch(
        'https://api.minepi.com/v2/payments/' + b.paymentId + '/approve',
        {
          method: 'POST',
          headers: { 'Authorization': 'key ' + env.PI_API_KEY }
        }
      )
      const d = await res.json()
      return new Response(JSON.stringify(d), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch(e) {
      return new Response(e.message, { status: 500 })
    }
  }
}
