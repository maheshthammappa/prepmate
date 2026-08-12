package prepintai.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GroqService {

    private static final Logger logger = LoggerFactory.getLogger(GroqService.class);
    private static final String GROQ_AUDIO_TRANSCRIPTIONS_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${groq.api.key}")
    private String groqApiKey;

    public GroqService() {
        this.restClient = RestClient.create();
        this.objectMapper = new ObjectMapper();
    }

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    public record GroqTranscriptionResponse(String text) {}

    public String transcribeAudio(MultipartFile file) {
        try {
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            
            org.springframework.http.HttpHeaders fileHeaders = new org.springframework.http.HttpHeaders();
            fileHeaders.setContentType(org.springframework.http.MediaType.valueOf("audio/webm"));
            // Fallback filename if original is null
            String filename = file.getOriginalFilename();
            if (filename == null || filename.isBlank()) filename = "audio.webm";
            fileHeaders.setContentDispositionFormData("file", filename);
            
            org.springframework.http.HttpEntity<byte[]> fileEntity = new org.springframework.http.HttpEntity<>(file.getBytes(), fileHeaders);
            
            body.add("file", fileEntity);
            body.add("model", "whisper-large-v3");
            body.add("response_format", "json");

            String responseStr = restClient.post()
                    .uri(GROQ_AUDIO_TRANSCRIPTIONS_URL)
                    .header("Authorization", "Bearer " + groqApiKey)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            logger.info("Received transcription from Groq");
            
            GroqTranscriptionResponse response = objectMapper.readValue(responseStr, GroqTranscriptionResponse.class);
            return response.text();

        } catch (org.springframework.web.client.RestClientResponseException e) {
            logger.error("Groq API error response: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Failed to transcribe audio: " + e.getStatusText(), e);
        } catch (Exception e) {
            logger.error("Failed to transcribe audio with Groq API", e);
            throw new RuntimeException("Failed to transcribe audio", e);
        }
    }
}
