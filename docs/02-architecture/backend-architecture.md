# Backend Architecture
Built with a standard N-Tier architecture in Spring Boot.
1. **Controllers**: Handle HTTP requests (`AuthController`, `InterviewController`).
2. **Services**: Contain business logic and external API integrations (`GeminiService`, `GroqService`, `PineconeService`).
3. **Repositories**: Spring Data JPA interfaces for DB access.
4. **Entities**: JPA models mapped to PostgreSQL tables.
