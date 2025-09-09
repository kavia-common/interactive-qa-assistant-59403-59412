import React, { useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App
 * A minimal Q&A interface with:
 * - Header bar with app title
 * - Central question input form
 * - Result display area beneath
 * - Loading indicator and error messaging
 * - Light, modern, minimalistic theme using specified palette
 */
function App() {
  // Local UI state
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState([]); // list of { q, a, ts }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * PUBLIC_INTERFACE
   * handleSubmit
   * Handles form submission, validates input, shows loading, and produces a mock automated answer.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAnswer('');

    const trimmed = question.trim();
    if (!trimmed) {
      setError('Please enter a question.');
      return;
    }

    // Simulate async API call with mock backend
    setLoading(true);
    try {
      const response = await mockAsk(trimmed);
      setAnswer(response);
      setHistory((prev) => [{ q: trimmed, a: response, ts: Date.now() }, ...prev]);
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * PUBLIC_INTERFACE
   * mockAsk
   * Returns a mock automated answer for the given question, simulating an async backend.
   */
  const mockAsk = (q) => {
    return new Promise((resolve, reject) => {
      // Simulate latency
      const delay = 900 + Math.floor(Math.random() * 600);
      setTimeout(() => {
        // Very light "mock" logic
        if (/error|fail|crash/i.test(q)) {
          reject(new Error('The mock backend encountered an error while processing your request.'));
          return;
        }

        const templates = [
          `Here's a concise perspective on "${q}": Start by clarifying the goal, break it into steps, and iterate with feedback.`,
          `For your question "${q}", consider the key factors, compare alternatives, and choose the simplest approach that works.`,
          `A practical answer to "${q}": Define inputs/outputs, handle edge cases, and validate with small examples.`,
          `Thinking about "${q}", prioritize the most impactful actions first and measure outcomes to refine your approach.`,
          `Regarding "${q}", combine best practices with context-specific adjustments for an effective solution.`,
        ];
        const pick = templates[Math.floor(Math.random() * templates.length)];
        resolve(pick);
      }, delay);
    });
  };

  return (
    <div className="qa-app">
      {/* Header Bar */}
      <header className="qa-header" role="banner">
        <div className="qa-header__inner">
          <div className="qa-brand">
            <span className="qa-logo" aria-hidden="true">Q</span>
            <h1 className="qa-title">Interactive Q&A Agent</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="qa-main" role="main">
        <section className="qa-card">
          <h2 className="sr-only">Ask a question</h2>
          <form className="qa-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="question" className="qa-label">Your question</label>
            <div className="qa-input-row">
              <input
                id="question"
                name="question"
                type="text"
                className="qa-input"
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                aria-invalid={!!error}
                aria-describedby={error ? 'question-error' : undefined}
              />
              <button
                type="submit"
                className="qa-btn"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="qa-spinner" aria-hidden="true" />
                ) : (
                  'Ask'
                )}
              </button>
            </div>
            {error && (
              <p id="question-error" className="qa-error" role="alert">
                {error}
              </p>
            )}
          </form>

          {/* Result display */}
          <div className="qa-result" aria-live="polite" aria-atomic="true">
            {loading && (
              <div className="qa-loading">
                <span className="qa-spinner large" aria-hidden="true" />
                <span className="qa-loading-text">Generating answer…</span>
              </div>
            )}

            {!loading && answer && (
              <div className="qa-answer">
                <h3 className="qa-answer__title">Answer</h3>
                <p className="qa-answer__text">{answer}</p>
              </div>
            )}

            {!loading && !answer && !error && (
              <div className="qa-placeholder">
                Ask anything to get started.
              </div>
            )}
          </div>
        </section>

        {/* History */}
        {history.length > 0 && (
          <section className="qa-history">
            <h2 className="qa-history__title">Recent</h2>
            <ul className="qa-history__list">
              {history.map((item) => (
                <li className="qa-history__item" key={item.ts}>
                  <div className="qa-history__q">
                    <span className="qa-chip">Q</span>
                    <span className="qa-history__text">{item.q}</span>
                  </div>
                  <div className="qa-history__a">
                    <span className="qa-chip qa-chip--accent">A</span>
                    <span className="qa-history__text">{item.a}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="qa-footer" role="contentinfo">
        <span>Built with React</span>
      </footer>
    </div>
  );
}

export default App;
