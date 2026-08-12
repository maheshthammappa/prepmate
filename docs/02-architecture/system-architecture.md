# System Architecture
```mermaid
flowchart TD
    User([User / Browser]) <--> Frontend[React SPA]
    Frontend <--> Backend[Spring Boot API]
    Backend <--> Database[(PostgreSQL)]
    Backend <--> Gemini[Google Gemini API]
    Backend <--> Pinecone[(Pinecone Vector DB)]
    Backend <--> Groq[Groq Whisper API]
```
