package prepmate.auth.dto;

public record LoginRequest(
    String username,
    String password
) {}
