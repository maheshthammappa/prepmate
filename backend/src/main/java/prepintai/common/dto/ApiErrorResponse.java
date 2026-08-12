package prepintai.common.dto;

import java.time.LocalDateTime;

public record ApiErrorResponse(
    boolean success,
    String message,
    String code,
    LocalDateTime timestamp,
    String path
) {}
