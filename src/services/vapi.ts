import { httpFetch } from './http';

export async function triggerVAPICall(alertText: string) {
  const res = await httpFetch('https://api.vapi.ai/trigger-call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
    },
    body: JSON.stringify({
      message: alertText,
    }),
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`VAPI error: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

