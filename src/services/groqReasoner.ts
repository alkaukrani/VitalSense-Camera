import { httpFetch } from './http';

export async function groqReasoner(signalData: any, patientContext: any) {
  const body = {
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      {
        role: 'user',
        content: `Given signal data: ${JSON.stringify(signalData)} and patient context: ${JSON.stringify(
          patientContext
        )}, classify the medical event and recommend action.`,
      },
    ],
  };

  const res = await httpFetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json;
}

