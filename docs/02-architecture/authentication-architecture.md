# Authentication Architecture
Stateless JWT-based authentication.
1. User logs in via `/api/auth/login`.
2. Backend validates credentials against the `users` table.
3. Backend issues a JWT signed with `jwt.secret`.
4. Frontend stores the JWT and sends it in the `Authorization: Bearer <token>` header.
5. `JwtAuthFilter` intercepts requests and sets the SecurityContext.
