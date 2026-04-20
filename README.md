# Teacher Bot 🎓

An AI-powered academic assistant for students in Bangladesh, built on the NCTB curriculum.
Features bilingual support (English + Bengali), TTS audio responses, and voice input.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env and add your Gemini API key
npm run dev
```

## Deploy to Netlify

1. Push this repo to GitHub
2. Connect it in [Netlify](https://app.netlify.com) → **Add new site → Import from Git**
3. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Go to **Site settings → Environment variables** and add:
   ```
   VITE_GEMINI_API_KEY = your_key_here
   ```
5. Trigger a redeploy — done!

## Deploy to Render

1. Push this repo to GitHub
2. Go to [Render](https://render.com) → **New → Static Site**
3. Connect your repo — Render auto-detects `render.yaml`
4. In the Render dashboard, add the environment variable:
   ```
   VITE_GEMINI_API_KEY = your_key_here
   ```
5. Deploy!

## ⚠️ API Key Security Note

This is a **client-side app** — the Gemini API key is embedded in the browser bundle
at build time. This is fine for personal or demo projects but means anyone who views
source can extract the key.

For production use, consider:
- Setting strict API key restrictions in Google AI Studio (allowed HTTP referrers)
- Building a thin Express proxy on the backend so the key never reaches the browser

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | ✅ | Your Google Gemini API key |
