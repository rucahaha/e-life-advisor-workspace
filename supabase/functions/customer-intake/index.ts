// Edge Function planning skeleton: deploy only after authentication, rate limiting,
// allowed-origin and schema-validation choices have been approved.
const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_CUSTOMER_ORIGIN') ?? '',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  // TODO: parse + validate only the documented intake fields, rate limit, create
  // a UUID caseId and private lookup token server-side, then insert with status requested.
  // Never return contact data and never include service role credentials in frontend code.
  return Response.json({ error: 'Customer intake is not configured for this concept prototype.' }, { status: 503, headers: corsHeaders })
})
