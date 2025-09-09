 /**
  * PUBLIC_INTERFACE
  * postAnswer
  * A thin wrapper around fetch to call the backend proxy that talks to OpenAI.
  * Reads the base URL from REACT_APP_API_URL and posts the user's question.
  * This ensures API keys are never embedded in client code.
  */
export async function postAnswer(question) {
  /** This is a public function. */
  const baseUrl = process.env.REACT_APP_API_URL || '';
  const endpoint = `${baseUrl}/answer`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Do NOT attach API keys here; keys must be used server-side only.
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    let details = '';
    try {
      const errData = await res.json();
      details = errData?.error || errData?.message || '';
    } catch {
      // ignore JSON parse failure
    }
    const msg = `Failed to get answer${details ? `: ${details}` : ''}`;
    const error = new Error(msg);
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  // Expecting shape: { answer: "..." }
  if (!data || typeof data.answer !== 'string') {
    throw new Error('Unexpected response format from the API.');
  }
  return data.answer;
}
