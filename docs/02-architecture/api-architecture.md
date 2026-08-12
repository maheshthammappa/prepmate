# API Architecture
RESTful API design. All endpoints except `/api/auth/**` require a valid JWT.
Payloads use standard JSON format, defined via DTOs (e.g., `QuestionGenRequest`, `AuthResponse`).
