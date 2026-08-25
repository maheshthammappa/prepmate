package prepmate.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PineconeService {

    private static final Logger logger = LoggerFactory.getLogger(PineconeService.class);
    private final RestClient restClient;

    @Value("${pinecone.api.key}")
    private String pineconeApiKey;

    @Value("${pinecone.index.host}")
    private String pineconeIndexHost;

    public PineconeService() {
        this.restClient = RestClient.create();
    }

    // Helper records for JSON payload
    record PineconeUpsertRequest(List<Vector> vectors, String namespace) {
        record Vector(String id, List<Double> values, Map<String, Object> metadata) {}
    }

    record PineconeQueryRequest(String namespace, List<Double> vector, int topK, boolean includeValues, boolean includeMetadata, Map<String, Object> filter) {}

    record PineconeQueryResponse(List<Match> matches, String namespace) {
        record Match(String id, double score, Map<String, Object> metadata) {}
    }

    /**
     * Queries Pinecone to find the highest similarity score for the given vector.
     * Returns the highest similarity score (0.0 to 1.0) found in the user's namespace.
     */
    public double findHighestSimilarity(String topic, String userId, List<Double> vector) {
        if (pineconeApiKey == null || pineconeApiKey.isBlank() || pineconeIndexHost == null || pineconeIndexHost.isBlank()) {
            logger.warn("Pinecone is not configured. Skipping similarity check.");
            return 0.0;
        }

        String url = pineconeIndexHost + "/query";
        // Convert topic to lowercase for consistent namespace
        String namespace = topic.toLowerCase().replaceAll("[^a-z0-9]", "-");

        Map<String, Object> filter = Map.of("userId", Map.of("$eq", userId));
        PineconeQueryRequest request = new PineconeQueryRequest(namespace, vector, 1, false, false, filter);

        try {
            PineconeQueryResponse response = restClient.post()
                    .uri(url)
                    .header("Api-Key", pineconeApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(PineconeQueryResponse.class);

            if (response != null && response.matches() != null && !response.matches().isEmpty()) {
                return response.matches().get(0).score();
            }
        } catch (Exception e) {
            logger.error("Failed to query Pinecone for similarity check: {}", e.getMessage());
        }
        return 0.0;
    }

    /**
     * Upserts a newly mastered question into the Pinecone index.
     */
    public void upsertMasteredQuestion(String topic, String userId, String questionText, List<Double> vector) {
        if (pineconeApiKey == null || pineconeApiKey.isBlank() || pineconeIndexHost == null || pineconeIndexHost.isBlank()) {
            logger.warn("Pinecone is not configured. Skipping upsert.");
            return;
        }

        String url = pineconeIndexHost + "/vectors/upsert";
        String namespace = topic.toLowerCase().replaceAll("[^a-z0-9]", "-");
        String id = UUID.randomUUID().toString();
        
        Map<String, Object> metadata = Map.of(
                "userId", userId,
                "questionText", questionText
        );

        PineconeUpsertRequest.Vector vec = new PineconeUpsertRequest.Vector(id, vector, metadata);
        PineconeUpsertRequest request = new PineconeUpsertRequest(List.of(vec), namespace);

        try {
            restClient.post()
                    .uri(url)
                    .header("Api-Key", pineconeApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
            logger.info("Successfully memorized mastered question in Pinecone for user {} in topic {}", userId, topic);
        } catch (Exception e) {
            logger.error("Failed to upsert question to Pinecone: {}", e.getMessage());
        }
    }
}
