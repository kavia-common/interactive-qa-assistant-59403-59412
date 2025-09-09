 /**
  * PUBLIC_INTERFACE
  * postAnswer
  * A thin wrapper around fetch to call the backend proxy that talks to OpenAI.
  * Reads the base URL from REACT_APP_API_URL and posts the user's question.
  * This ensures API keys are never embedded in client code.
  */

/**
 * Join base URL and path, avoiding duplicate slashes.
 * If base is falsy, returns the path as-is (for same-origin usage).
 */
function joinUrl(base, path) {
  if (!base) return path;
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

// PUBLIC_INTERFACE
export async function postAnswer(question) {
  /** This is a public function. */
  const baseUrl = process.env.REACT_APP_API_URL || '';
  const endpoint = joinUrl(baseUrl, '/answer');

  let res;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Do NOT attach API keys here; keys must be used server-side only.
      },
      body: JSON.stringify({ question }),
    });
  } catch (networkErr) {
    const hint = baseUrl
      ? `Cannot reach ${endpoint}. Check CORS, server availability, or REACT_APP_API_URL.`
      : `Cannot reach ${endpoint}. No REACT_APP_API_URL set; attempting same-origin. Ensure a backend is serving POST /answer.`;
    const error = new Error(`Network error while contacting backend. ${hint}`);
    error.cause = networkErr;
    throw error;
  }

  if (!res.ok) {
    let details = '';
    try {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const errData = await res.json();
        details = errData?.error || errData?.message || '';
      } else {
        const txt = await res.text();
        details = txt?.slice(0, 500);
      }
    } catch {
      // ignore parse failures
    }
    const prefix =
      res.status === 404
        ? 'Endpoint not found'
        : res.status === 401 || res.status === 403
        ? 'Unauthorized to call backend'
        : 'Failed to get answer';
    const msg = `${prefix}${details ? `: ${details}` : ''}`;
    const error = new Error(msg);
    error.status = res.status;
    throw error;
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Unexpected non-JSON response from the API.');
  }

  // Expecting shape: { answer: "..." }
  if (!data || typeof data.answer !== 'string') {
    throw new Error('Unexpected response format from the API.');
  }
  return data.answer;
}

// PUBLIC_INTERFACE
export async function checkBackend() {
  /** This is a public function. */
  const baseUrl = process.env.REACT_APP_API_URL || '';
  const endpoint = joinUrl(baseUrl, '/answer');

  try {
    // OPTIONS probe first; may be blocked but cheap if supported
    const optionsRes = await fetch(endpoint, { method: 'OPTIONS' }).catch(() => null);
    if (optionsRes && optionsRes.ok) {
      return { ok: true, baseUrl: baseUrl || '(same-origin)' };
    }

    // Fallback probe via POST with empty question
    const probe = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: '' }),
    });
    return { ok: probe.ok, status: probe.status, baseUrl: baseUrl || '(same-origin)' };
  } catch (e) {
    return {
      ok: false,
      error: e?.message || 'Network error',
      baseUrl: baseUrl || '(same-origin)',
    };
  }
}
