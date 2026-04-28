# 🗳️ VoteWise — Interactive Election Guide Assistant

## Challenge Vertical
Civic Education: Helping citizens understand the election process, timelines, and steps.

## Approach & Logic
VoteWise is a single-page web app that makes elections easy to understand through:
- A visual clickable **step-by-step timeline** of the election process
- A **Gemini AI-powered chat assistant** for dynamic Q&A
- A **knowledge quiz** to reinforce learning
- **Text-to-Speech** (Google Web Speech API) for accessibility

## Google Services Used
1. **Google Gemini API** — powers the AI chat assistant
2. **Google Web Speech API** — reads answers aloud for accessibility

## How the Solution Works
1. User clicks any step in the timeline to learn about that phase
2. User can ask any election-related question to the AI assistant
3. AI responds using Gemini with simple, first-voter-friendly answers
4. User can press 🔊 to hear the answer read aloud
5. User can test their knowledge with the 5-question quiz

## Assumptions
- Focused on the Indian election process (can be adapted for any country)
- Gemini API free tier is used (no billing required for low usage)
- Designed for desktop and mobile browsers

## How to Test
1. Open `index.html` in any browser (Chrome recommended)
2. Click each timeline step
3. Type a question in the chat box and press Enter or Send
4. Press 🔊 to hear the answer
5. Complete the quiz and submit

## Setup
Replace `YOUR_GEMINI_API_KEY` in `script.js` with your key from https://aistudio.google.com

## Security
API key is domain-restricted via Google AI Studio referrer settings.
Input is sanitized to prevent XSS. Rate limiting applied at 10 requests/minute.
In production, API calls would be proxied server-side.