# 🎯 PrepMate AI — Smart Interview Preparation & Speaking Coach

PrepMate AI is a full-stack, AI-driven interview preparation web platform designed to help students and software engineers practice realistic job interviews, enhance English speaking fluency, and get instant, structured feedback.

---

## 🌟 Key Features

1. **Role-Based Mock Interviews**:
   - Practice for **Frontend, Backend, Full Stack, Java, and HR** roles across Junior, Mid, and Senior difficulty.
   - Text-to-Speech (TTS) reads interviewer questions out loud.
   - Answer via live microphone Speech-to-Text (STT) or typing.
   - Instant scoring out of 10, mistakes breakdown, 10/10 sample answers, and contextual follow-up questions.

2. **English Speaking & Fluency Coach**:
   - Random prompt generator with real-world communication scenarios.
   - Automated speech-to-text live transcription.
   - AI evaluations of **Grammar, Vocabulary, Fluency, and Confidence**.
   - Polished executive rewrite of your response.

3. **HR Behavioral Simulator**:
   - Practice top behavioral questions (Tell me about yourself, Strengths & Weaknesses, Conflict resolution).
   - Structured guidance using the **STAR** method (Situation, Task, Action, Result).

4. **Technical Q&A & Quiz Arena**:
   - Interactive quizzes for **JavaScript, React, Node.js, MongoDB, and DSA**.
   - Instant visual feedback and deep conceptual explanations.

5. **Resume-Tailored Questions**:
   - Paste your resume text or project bullet points.
   - AI extracts your tech stack and drafts targeted architectural questions.

6. **Candidate Progress Dashboard**:
   - Daily streak tracking (gamified).
   - Average interview score across rounds.
   - Identified weak areas and session history saved in MongoDB.

---

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Axios, React Router.
- **Backend**: Node.js, Express, Mongoose (MongoDB Atlas), JWT, bcryptjs, express-rate-limit.
- **AI Engine**: Google Gemini API (called strictly from backend; safe mock fallbacks included).
- **Voice**: Browser Native Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).
- **Monorepo**: Single unified directory with concurrent dev execution.

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (local or MongoDB Atlas connection string)

### 2. Install Dependencies
In the root directory (`prepmate-ai`), run:
```bash
npm run install-all
```
*(This automatically runs `npm install` for the root, backend, and frontend)*

### 3. Setup Environment Variables

#### Backend (`server/.env`):
Duplicate `server/.env.example` into `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/prepmate?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_prepmate_ai_2026
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
> *Note: If `GEMINI_API_KEY` is not provided, PrepMate AI automatically runs in smart simulated mode so you can test all features without an API key!*

#### Frontend (`client/.env`):
Duplicate `client/.env.example` into `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Application
Run one command in the root folder:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`

---

## 🌐 Production Deployment Steps

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User and whitelist `0.0.0.0/0` (allow access from anywhere).
3. Copy your connection string into `MONGODB_URI`.

### 2. Backend Deployment (Render.com)
1. Push this folder to GitHub.
2. In Render, select **New Web Service** and connect your repository.
3. Set **Root Directory**: `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `CLIENT_URL` = Your Vercel frontend URL
7. Copy your deployed Render URL (e.g. `https://prepmate-api.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. In Vercel, import your GitHub repository.
2. Set **Root Directory**: `client`
3. Set **Framework Preset**: `Vite`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://prepmate-api.onrender.com/api`
5. Click **Deploy**!

---

## 🛡️ Security & Best Practices
- **API Key Safety**: Gemini API keys live exclusively in backend `.env` variables and are never bundled into client JavaScript.
- **Rate Limiting**: Built-in `express-rate-limit` guards against denial-of-service and quota exhaustion.
- **JWT Protection**: Passwords are securely hashed with `bcryptjs` (salt rounds: 10).
