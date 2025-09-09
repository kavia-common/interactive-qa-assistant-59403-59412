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
- `src/apiClient.js` - API client for calling the backend proxy

## Environment
Create a `.env` based on `.env.example`:
```
REACT_APP_API_URL=https://your-backend.example.com
```
Do NOT place any OpenAI API keys in the frontend. The frontend calls a backend proxy at `${REACT_APP_API_URL}/answer`, which securely uses the OpenAI key on the server.

## Backend contract
POST `${REACT_APP_API_URL}/answer`
- Body: `{ "question": "<user question>" }`
- Response: `{ "answer": "<answer text>" }`
- On error: return a non-2xx status with `{ "error": "message" }`

## Accessibility
- Inputs and dynamic regions are annotated with `aria-*` attributes.
- Live region is used for announcements of results and errors.
