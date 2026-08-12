<div align="center">

# 🎯 PrepMate — AI Interview Coach

**An intelligent, full-stack interview preparation platform powered by Google Gemini.**  
Practice with tailored questions, get AI-evaluated feedback, track your weaknesses, and master your skills — all in one place.

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Question Generation** | Gemini-powered questions tailored to topic, experience level, and **question style** (Mixed / Definitions / Conceptual / Scenario-Based) |
| 📄 **Resume-Based Interviews** | Upload a PDF or paste text — the AI generates questions targeting your exact tech stack and projects |
| 🧠 **AI Evaluation & Scoring** | Answers are scored 0–100 with detailed feedback and a model answer for every question |
| 🔁 **Spaced Repetition Practice** | Questions you fail are saved and surfaced again via spaced repetition until you master them |
| 📌 **Mastery Tracking** | Questions scored ≥ 70 are embedded with Gemini and stored in Pinecone for semantic deduplication |
| 📊 **Interview History** | Full session history with per-question breakdowns, strengths, weaknesses, and improvement tips |
| 🎙️ **Voice Answers** | Transcribe spoken answers via the Groq Whisper API |
| 💬 **Ask a Doubt** | In-session AI mentor to explain any concept on the fly |
| 🔐 **JWT Authentication** | Secure registration / login with JWT-based stateless auth |

---

## 🏗️ Architecture

```
prepmate/
├── backend/          # Spring Boot 4.1 REST API (Java 21)
│   ├── ai/           # GeminiService, GroqService, PineconeService
│   ├── auth/         # User entity, JWT filter, auth controller
│   ├── interview/    # Entities, DTOs, controller, repositories
│   └── security/     # Spring Security config
│
└── frontend/         # React 19 + Vite SPA
    └── src/
        ├── features/
        │   ├── interview/   # Setup, session, results, history pages
        │   ├── auth/        # Login & register pages
        │   └── dashboard/   # Home dashboard
        └── services/        # Axios API client
```

---

## 🛠️ Tech Stack

### Backend
- **Java 21** + **Spring Boot 4.1**
- **Spring Security** + **JWT** (jjwt 0.12.5)
- **Spring Data JPA** + **PostgreSQL**
- **Apache PDFBox 3** — resume PDF parsing
- **Google Gemini API** — question generation, evaluation, embeddings
- **Pinecone** — vector database for semantic mastery deduplication
- **Groq API (Whisper)** — audio transcription
- **Docker** — containerised deployment

### Frontend
- **React 19** + **React Router 7**
- **Vite 8**
- **Axios** — API client
- **Lucide React** — icons
- **React Markdown** — rich AI answer rendering
- **Vanilla CSS** with CSS custom properties (design tokens)

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Java JDK | 21+ |
| Maven | 3.9+ (or use `./mvnw`) |
| Node.js | 18+ |
| PostgreSQL | 14+ |

---

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/prepmate.git
cd prepmate
```

---

### 2. Backend Setup

#### a) Configure secrets

Copy the example and fill in your keys:

```bash
cd backend
cp src/main/resources/application.example.properties src/main/resources/application.properties
```

Edit `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/prepmate
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD

# Google Gemini
gemini.api.key=YOUR_GEMINI_API_KEY
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

# Pinecone
pinecone.api.key=YOUR_PINECONE_API_KEY
pinecone.index.url=YOUR_PINECONE_INDEX_URL

# Groq (audio transcription)
groq.api.key=YOUR_GROQ_API_KEY

# JWT
jwt.secret=YOUR_JWT_SECRET_KEY
jwt.expiration=86400000
```

#### b) Run the backend

```bash
./mvnw spring-boot:run
# API available at http://localhost:8080
```

Or build a JAR:

```bash
./mvnw clean package -DskipTests
java -jar target/*.jar
```

---

### 3. Frontend Setup

```bash
cd frontend

# Copy and configure environment
cp .env.example .env.local
# Set VITE_API_BASE_URL=http://localhost:8080 (default)

# Install dependencies
npm install

# Start dev server
npm run dev
# App available at http://localhost:5173
```

---

### 4. Docker (Backend only)

```bash
cd backend
docker build -t prepmate-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/prepmate \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=yourpassword \
  -e GEMINI_API_KEY=yourkey \
  prepmate-backend
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `POST` | `/api/interview/generate` | Generate questions by topic + style |
| `POST` | `/api/interview/generate-from-resume` | Generate questions from resume file/text |
| `POST` | `/api/interview/evaluate` | Evaluate submitted answers |
| `POST` | `/api/interview/practice-generate` | Generate spaced-repetition practice questions |
| `POST` | `/api/interview/ask-doubt` | Get an AI explanation for any concept |
| `POST` | `/api/interview/transcribe` | Transcribe audio answer to text |
| `GET` | `/api/interview/history` | List all past interview sessions |
| `GET` | `/api/interview/history/{id}` | Get full detail of a specific session |
| `GET` | `/api/interview/mastered-questions` | List mastered questions (paginated) |

---

## 🧪 Running Tests

```bash
# Backend unit tests
cd backend
./mvnw test

# Frontend lint
cd frontend
npm run lint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  Built with ❤️ using Google Gemini, Spring Boot, and React
</div>














but you use images and figures wherever needed and content should be fully based on project not on your own okay these are strict rules remeber 