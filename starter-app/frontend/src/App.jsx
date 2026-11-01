import { useState } from 'react';

// VITE_* values are compiled into browser-visible assets. This value is an
// endpoint URL, not a secret. Never put credentials or API keys here.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function checkApi() {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/status`);

      // fetch() does not reject merely because the HTTP status is 4xx or 5xx.
      // Check response.ok before treating the response as a successful result.
      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}`);
      }

      const payload = await response.json();
      setResult(payload);
    } catch (err) {
      // Network errors and browser-enforced CORS failures can both appear
      // here as a generic fetch error. Use DevTools and direct API evidence
      // to distinguish them; do not infer the root cause from this message.
      setError(err instanceof Error ? err.message : 'Unknown request failure');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <p className="eyebrow">TRACK II · WEEK 1</p>
        <h1>GroundOps: request tracing</h1>
        <p className="intro">
          Follow one user action across a browser, a React frontend and a FastAPI API.
        </p>

        <dl className="facts">
          <div><dt>Browser origin</dt><dd>{window.location.origin}</dd></div>
          <div><dt>Configured API base URL</dt><dd>{API_BASE_URL}</dd></div>
        </dl>

        <button type="button" onClick={checkApi} disabled={loading}>
          {loading ? 'Request in progress…' : 'Check API'}
        </button>

        {result && (
          <section className="result success" aria-live="polite">
            <h2>Response received</h2>
            <p><strong>Service:</strong> {result.service}</p>
            <p><strong>Status:</strong> {result.status}</p>
            <p>{result.message}</p>
            <p><strong>API version:</strong> {result.version}</p>
          </section>
        )}

        {error && (
          <section className="result failure" role="alert">
            <h2>Request failed</h2>
            <p>{error}</p>
            <p className="hint">
              This message is a symptom, not a root cause. Open browser DevTools →
              Network and Console, then compare the request with a direct API check.
            </p>
          </section>
        )}

        <p className="footnote">
          Training note: a successful frontend render does not prove the API path works.
        </p>
      </section>
    </main>
  );
}
