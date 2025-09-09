import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  render(<App />);
  const title = screen.getByText(/Interactive Q&A Agent/i);
  expect(title).toBeInTheDocument();
});

test('renders ask button', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /ask/i });
  expect(button).toBeInTheDocument();
});
