# Q&A Assistant - React Frontend

A modern, minimalistic React web app for a Q&A agent. It provides:
- A header bar with the app title
- A central question input form
- A result display area with loading and error states
- Responsive layout

## Tech
- React 18
- Vanilla CSS, no heavy UI frameworks

## Color Palette
- Primary: `#1976d2`
- Accent: `#ff9800`
- Secondary: `#424242`

## Available Scripts
- `npm start` - Start dev server
- `npm test` - Run tests
- `npm run build` - Production build

## Structure
- `src/App.js` - Main UI and behavior
- `src/App.css` - Styles using CSS variables with the provided palette
- `src/index.js` - Entry point

## Replace Mock Answer
The app currently simulates answers. To connect a real backend:
1. Replace `getAutomatedAnswer` in `src/App.js` with a `fetch` call to your API endpoint.
2. Preserve loading and error state handling.
3. Consider reading API URL from env variables (e.g. `REACT_APP_API_URL`) set in `.env`.

Example:
```js
const res = await fetch(`${process.env.REACT_APP_API_URL}/answer`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: trimmed })
});
if (!res.ok) throw new Error('Failed to get answer');
const data = await res.json();
setAnswer(data.answer);
```

## Accessibility
- Inputs and dynamic regions are annotated with `aria-*` attributes.
- Live region is used for announcements of results and errors.
