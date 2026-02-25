# AI Chatbot Demo (Static)

Single-page website with a floating chatbot widget in the lower-right corner.

This version is frontend-only and works on GitHub Pages.

## How it works

- Uses plain HTML/CSS/JS (no backend server)
- Calls Hugging Face chat completions API directly from browser
- Stores token and model in browser `localStorage`

## Local preview

Open `public/index.html` directly in your browser, or serve `public/` with any static server.

## Deploy to GitHub Pages

1. Push this project to a GitHub repo.
2. In GitHub: `Settings -> Pages`.
3. Under `Build and deployment`, select `Deploy from a branch`.
4. Choose branch `main` (or your default branch) and folder `/public`.
5. Save and open your Pages URL.

## First use

1. Open `public/app.js`.
2. Set `HF_API_TOKEN` to your Hugging Face token.
3. Open the website and start chatting.

Create a token here: `https://huggingface.co/settings/tokens`

## Important note

Because this is frontend-only, your token is used in the browser and is visible to anyone with access to that browser session. For production apps, use a backend proxy.
