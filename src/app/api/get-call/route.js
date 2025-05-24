export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const callId = searchParams.get("callId");
  const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PRIVATE_VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return Response.json(data);
}
