# Environment Variables
## Backend (`application.properties`)
| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `spring.datasource.url` | DB connection | Yes | `jdbc:postgresql://localhost:5432/prepmate` |
| `spring.datasource.username` | DB User | Yes | `<redacted>` |
| `spring.datasource.password` | DB Pass | Yes | `<redacted>` |
| `gemini.api.key` | Google Gemini API Key | Yes | `<redacted>` |
| `pinecone.api.key` | Pinecone API Key | Yes | `<redacted>` |
| `groq.api.key` | Groq API Key | Yes | `<redacted>` |
| `jwt.secret` | JWT signing key | Yes | `<redacted>` |

## Frontend (`.env.local`)
| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `VITE_API_BASE_URL` | Backend URL | Yes | `http://localhost:8080` |
