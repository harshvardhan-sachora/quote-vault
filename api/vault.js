// api/vault.js
// This is the real "backend + database" lesson of this project.
// It stores saved quotes in Vercel KV — a small database that lives on
// Vercel's servers. Unlike localStorage, this data is the SAME for every
// visitor to the site, because it's stored on a server, not in one browser.

import { kv } from '@vercel/kv';

const VAULT_KEY = 'quote-vault:entries';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const raw = await kv.lrange(VAULT_KEY, 0, -1);
      const quotes = raw.map(item => (typeof item === 'string' ? JSON.parse(item) : item));
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
      await kv.lpush(VAULT_KEY, JSON.stringify(entry));
      return res.status(200).json({ entry });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id.' });

      const raw = await kv.lrange(VAULT_KEY, 0, -1);
      const match = raw.find(item => {
        const parsed = typeof item === 'string' ? JSON.parse(item) : item;
        return parsed.id === id;
      });
      if (match) await kv.lrem(VAULT_KEY, 1, match);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error('Vault error:', err);
    return res.status(500).json({ error: 'The vault database is not connected yet. See README setup steps.' });
  }
}
