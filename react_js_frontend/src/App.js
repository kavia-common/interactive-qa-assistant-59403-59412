import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App
 * A modern, minimalistic Q&A interface.
 * - Header with app title
 * - Central question input with submit
 * - Result display with loading and error states
 * - Responsive layout
 * Styling uses CSS variables and the provided palette:
 *  primary: #1976d2, accent: #ff9800, secondary: #424242
 */
function App() {
  const [theme] = useState('light'); // fixed light theme as requested
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Apply theme to document root (kept for extensibility; theme is 'light')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /**
   * Simulate an async "answer" generation
   * Replace this with a real API call when backend is available.
   */
  const getAutomatedAnswer = useCallback(async (q) => {
    // Simulated latency
    await new Promise((res) => setTimeout(res, 900));
    // Simple placeholder logic
    if (!q || q.trim().length === 0) {
      // This is guarded earlier, but keep a fallback
      throw new Error('Please enter a question.');
    }
    // Naive "answer" generator
    const templates = [
      `Here’s a concise explanation for: "${q}". This system currently uses a mock responder. Replace with a real API to get accurate answers.`,
      `Answer for "${q}": This is a placeholder response. Integrate with your backend to retrieve real answers.`,
      `You asked: "${q}". A detailed response will appear here once connected to your answer service.`,
    ];
    const idx = Math.floor(Math.random() * templates.length);
    return templates[idx];
  }, []);

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAnswer('');
    const trimmed = question.trim();
    if (trimmed.length === 0) {
      setError('Please enter a question before submitting.');
      return;
    }
    setLoading(true);
    try {
      const res = await getAutomatedAnswer(trimmed);
      setAnswer(res);
    } catch (err) {
      setError(err?.message || 'Something went wrong while fetching the answer.');
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const clearAll = () => {
    setQuestion('');
    setAnswer('');
    setError('');
  };

  return (
    <div className="app-root">
      <header className="app-header" role="banner">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-dot" aria-hidden="true" />
            <h1 className="brand-title">Q&A Assistant</h1>
          </div>
        </div>
      </header>

      <main className="app-main" role="main">
        <section className="qa-card" aria-label="Question and Answer">
          <form className="qa-form" onSubmit={handleSubmit} aria-label="Ask a question">
            <label htmlFor="question-input" className="visually-hidden">
              Enter your question
            </label>
            <input
              id="question-input"
              type="text"
              className="qa-input"
              placeholder="Ask your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'error-text' : undefined}
            />
            <div className="actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                aria-busy={loading ? 'true' : 'false'}
              >
                {loading ? 'Thinking…' : 'Ask'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={clearAll}
                disabled={loading && !error && !answer && question.length === 0}
                title="Clear"
              >
                Clear
              </button>
            </div>
          </form>

          <div className="result-area" aria-live="polite" aria-atomic="true">
            {loading && (
              <div className="loading">
                <span className="spinner" aria-hidden="true" />
                <span className="loading-text">Generating answer…</span>
              </div>
            )}
            {!!error && !loading && (
              <div className="error" id="error-text" role="alert">
                {error}
              </div>
            )}
            {!!answer && !loading && !error && (
              <div className="answer">
                <div className="answer-label">Answer</div>
                <div className="answer-content">{answer}</div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer" role="contentinfo">
        <span className="footnote">
          Tip: This is a demo UI. Connect to your backend API to return real answers.
        </span>
      </footer>
    </div>
  );
}

export default App;
