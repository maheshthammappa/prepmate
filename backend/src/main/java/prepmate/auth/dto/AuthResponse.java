package prepmate.auth.dto;

public record AuthResponse(
    String token,
    String username,
    String email
) {}
