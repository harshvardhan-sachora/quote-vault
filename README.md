# Quote Vault

A quote generator with a real backend and database — pull a random quote, save the ones worth keeping, and they stay saved for every visitor to the site, not just you. Styled like a vintage library card catalog, with quotes appearing as typewritten index cards.

## Live Demo
[View it here]  https://quote-vault-nine.vercel.app/
https://quote-vault-nine.vercel.app/

## Why this project matters
Every project before this one stored data only in the browser (or not at all). This one has a **real backend**: two serverless functions that run on a server, plus a real database (Redis) that every visitor shares. Saving a quote here is genuinely different from earlier projects — it's not localStorage, it's a server writing to a database.

## Features
- Pull a random quote from a free public quote API
- Save favorite quotes to a shared, permanent database
- Remove saved quotes
- Every visitor sees the same saved collection — proof it's a real shared backend, not per-browser storage
- Clear, in-voice error handling if the quote service or database is unreachable

## Architecture
- `api/quote.js` — fetches a random quote from ZenQuotes through the backend (avoids browser CORS issues)
- `api/vault.js` — reads, adds, and deletes saved quotes in a Redis database using `ioredis`, connected via a `REDIS_URL` environment variable set in Vercel

## Built With
- HTML, CSS, JavaScript (vanilla frontend — no frameworks)
- Node.js serverless functions (Vercel)
- Redis (via Vercel Marketplace) for persistent shared storage
- [ZenQuotes API](https://zenquotes.io/) for quote content

## What I Learned
- The real difference between browser storage (per-device) and a backend database (shared, permanent, server-side)
- Writing serverless API functions that handle GET, POST, and DELETE requests
- Connecting a Node backend to a real Redis database using a connection string
- Why a project's file structure (like where `package.json` lives) actually matters for deployment — a misplaced file broke the whole backend during development, which is a good reminder that folder structure isn't just organization, it's part of how the deployment platform finds and builds your code
- Handling database and network errors gracefully instead of letting the app crash

## Run It Locally
This project requires a live Redis database connection to fully function (the save/vault features won't work without it). Cloning the frontend alone (`index.html`) will still show the quote-pulling feature if you deploy the `api/quote.js` function, but full functionality requires:
1. A Redis database (created via Vercel Marketplace or any Redis provider)
2. A `REDIS_URL` environment variable set to that database's connection string
3. Deploying the whole project (not just running the HTML file directly) since it depends on serverless functions

## Author
Built by Harshvardhan Sachora as part of a growing portfolio of independent projects.
