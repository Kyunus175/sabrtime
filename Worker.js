addEventListener('fetch',e=>{
e.respondWith(handle(e.request))
})
async function handle(r){
const b=await r.json()
const res=await fetch(
'https://api.minepi.com/v2/payments/'+b.paymentId+'/approve',
{method:'POST',headers:{'Authorization':'key '+PI_API_KEY}}
)
const d=await res.json()
return new Response(JSON.stringify(d),{
headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}
})
}
