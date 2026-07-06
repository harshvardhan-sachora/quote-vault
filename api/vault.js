// api/vault.js
// This is the real "backend + database" lesson of this project.
// It stores saved quotes in a real Redis database (connected via REDIS_URL).
// Unlike localStorage, this data is the SAME for every visitor to the site,
// because it lives on a server, not in one browser.

import Redis from 'ioredis';

const VAULT_KEY = 'quote-vault:entries';

// Reuse the same connection across requests instead of reconnecting every time
let client;
function getClient() {
  if (!client) {
    if (!process.env.REDIS_URL) {
      throw new Error('no-redis-url');
    }
    client = new Redis(process.env.REDIS_URL);
  }
  return client;
}

export default async function handler(req, res) {
  let redis;
  try {
    redis = getClient();
  } catch (err) {
    return res.status(500).json({ error: 'The database is not connected yet. Check REDIS_URL in Vercel settings.' });
  }

  try {
    if (req.method === 'GET') {
      const raw = await redis.lrange(VAULT_KEY, 0, -1);
      const quotes = raw.map(item => JSON.parse(item));
      return res.status(200).json({ quotes });
    }

    if (req.method === 'POST') {
      const { text, author } = req.body || {};
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Missing quote text.' });
      }
      const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        text: text.slice(0, 500),
        author: (author || 'Unknown').slice(0, 100)
      };
      await redis.lpush(VAULT_KEY, JSON.stringify(entry));
      return res.status(200).json({ entry });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id.' });

      const raw = await redis.lrange(VAULT_KEY, 0, -1);
      const match = raw.find(item => JSON.parse(item).id === id);
      if (match) await redis.lrem(VAULT_KEY, 1, match);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error('Vault error:', err);
    return res.status(500).json({ error: 'Something went wrong reading or writing the database.' });
  }
}
