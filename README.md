# Healthy Chatbot API

A simple Express REST middleware API for a health-conscious chatbot using Google Gemini.

## Features
- REST API endpoint: POST /api/chat
- Supports text input
- Supports file uploads for images, PDFs, text files, and audio
- Uses Gemini 2.5 Flash via the Google Generative AI SDK

## Setup
1. Copy .env.example to .env
2. Set your Gemini API key
3. Install dependencies:
   npm install
4. Start the server:
   npm start

## Example request
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Saran diet sehat untuk orang Indonesia"}'
```

## Important note
This project is a middleware API only. It is not a substitute for medical advice.
