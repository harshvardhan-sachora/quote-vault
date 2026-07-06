// api/quote.js
// A tiny backend endpoint that fetches a random quote from ZenQuotes
// (a free, no-key-required API) and hands it to the frontend.
// Going through our own backend avoids browser CORS issues and means
// if we ever swap quote providers, the frontend doesn't need to change.

export default async function handler(req, res) {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    if (!response.ok) throw new Error('bad-response');

    const data = await response.json();
    const entry = data && data[0];
    if (!entry || !entry.q) throw new Error('bad-shape');

    return res.status(200).json({ text: entry.q, author: entry.a || 'Unknown' });
  } catch (err) {
    console.error('Quote fetch failed:', err);
    return res.status(502).json({ error: 'Could not reach the quote service. Try again in a moment.' });
  }
}
