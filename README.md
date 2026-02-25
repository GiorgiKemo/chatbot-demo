# AI Chatbot Demo (Vercel + Hugging Face)

Single-page website with a floating chatbot widget in the lower-right corner.

## How it works

- Frontend is static HTML/CSS/JS in `public/`
- Frontend calls `/api/chat`
- Vercel Serverless Function in `api/chat.js` calls Hugging Face using server-side env var `HF_API_TOKEN`

## Deploy to Vercel

1. Import this repo in Vercel (`https://vercel.com/new`).
2. Project settings:
   - Framework Preset: `Other`
   - Build Command: leave empty
   - Output Directory: leave empty
3. In `Settings -> Environment Variables`, add:
   - `HF_API_TOKEN` = your Hugging Face token
4. Redeploy.

Create token here: `https://huggingface.co/settings/tokens`

## Local development

Use Vercel CLI so `/api/chat` works locally:

```bash
npx vercel dev
```

Then open `http://localhost:3000`.
