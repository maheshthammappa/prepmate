// ─────────────────────────────────────────────────────────────────────────────
// common/GlobalExceptionHandler.java
// ─────────────────────────────────────────────────────────────────────────────
package prepintai.common;

import prepintai.ai.GeminiServiceException;
import prepintai.common.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(GeminiServiceException.class)
    public ResponseEntity<ApiErrorResponse> handleGeminiServiceException(GeminiServiceException ex, HttpServletRequest request) {
        return buildResponse(ex.getMessage(), "SERVICE_UNAVAILABLE", HttpStatus.SERVICE_UNAVAILABLE, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleAllExceptions(Exception ex, HttpServletRequest request) {
        return buildResponse(ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred", 
                             "INTERNAL_SERVER_ERROR", 
                             HttpStatus.INTERNAL_SERVER_ERROR, 
                             request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        return buildResponse(ex.getMessage(), "BAD_REQUEST", HttpStatus.BAD_REQUEST, request);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        String message = ex.getMessage();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String code = "INTERNAL_SERVER_ERROR";
        
        if (message != null) {
            if (message.contains("Unauthorized")) {
                status = HttpStatus.UNAUTHORIZED;
                code = "UNAUTHORIZED";
            } else if (message.contains("not found")) {
                status = HttpStatus.NOT_FOUND;
                code = "NOT_FOUND";
            } else if (message.contains("taken") || message.contains("in use")) {
                status = HttpStatus.BAD_REQUEST;
                code = "BAD_REQUEST";
            }
        }
        
        return buildResponse(message, code, status, request);
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(String message, String code, HttpStatus status, HttpServletRequest request) {
        ApiErrorResponse response = new ApiErrorResponse(
            false,
            message,
            code,
            LocalDateTime.now(),
            request.getRequestURI()
        );
        return new ResponseEntity<>(response, status);
    }
}
