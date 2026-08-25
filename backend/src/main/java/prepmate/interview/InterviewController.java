// ─────────────────────────────────────────────────────────────────────────────
// interview/InterviewController.java
//
// PURPOSE:
//   Handles all REST API endpoints for generating questions, evaluating answers,
//   and retrieving interview history.
//
// DATA FLOW:
//   1. Generation: Frontend calls `/generate`. Controller parses the request,
//      calls `GeminiService`, and returns the raw list of questions.
//   2. Evaluation: Frontend calls `/evaluate` with the user's answers.
//      - Controller calls `GeminiService` to score them.
//      - It maps the AI report into an `InterviewSession` entity.
//      - It saves the session to the DB via `InterviewSessionRepository`.
//   3. History: Frontend calls `/history` to fetch past DB sessions.
// ─────────────────────────────────────────────────────────────────────────────
package prepmate.interview;

import prepmate.interview.dto.AnswerSubmission;
import prepmate.interview.dto.InterviewHistorySummary;
import prepmate.interview.dto.InterviewReport;
import prepmate.interview.dto.QuestionGenRequest;
import prepmate.interview.dto.QuestionResponse;
import prepmate.interview.dto.AskDoubtRequest;
import prepmate.interview.dto.AskDoubtResponse;
import prepmate.ai.GeminiService;
import prepmate.ai.GroqService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import java.util.List;
import java.util.stream.Collectors;
import prepmate.auth.User;
import prepmate.auth.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private final GeminiService geminiService;
    private final GroqService groqService;
    private final prepmate.ai.PineconeService pineconeService;
    private final InterviewSessionRepository interviewSessionRepository;
    private final UserRepository userRepository;
    private final PracticeQuestionRepository practiceQuestionRepository;
    private final MasteredQuestionRepository masteredQuestionRepository;

    public InterviewController(GeminiService geminiService,
            GroqService groqService,
            prepmate.ai.PineconeService pineconeService,
            InterviewSessionRepository interviewSessionRepository,
            UserRepository userRepository,
            PracticeQuestionRepository practiceQuestionRepository,
            MasteredQuestionRepository masteredQuestionRepository) {
        this.geminiService = geminiService;
        this.groqService = groqService;
        this.pineconeService = pineconeService;
        this.interviewSessionRepository = interviewSessionRepository;
        this.userRepository = userRepository;
        this.practiceQuestionRepository = practiceQuestionRepository;
        this.masteredQuestionRepository = masteredQuestionRepository;
    }

    private User getAuthenticatedUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Unauthorized access");
        }

        Object principal = authentication.getPrincipal();
        String username;
        if (principal instanceof org.springframework.security.core.userdetails.User) {
            username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
        } else {
            username = principal.toString();
        }

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found."));
    }

    @PostMapping("/generate")
    public QuestionResponse generateQuestions(@RequestBody QuestionGenRequest request) {
        int count = (request.questionCount() == null || request.questionCount() <= 0) ? 10 : request.questionCount();
        User user = getAuthenticatedUser();

        List<prepmate.interview.dto.QuestionEntry> finalQuestions = new java.util.ArrayList<>();
        int maxAttempts = 3;
        int attempt = 0;

        while (finalQuestions.size() < count && attempt < maxAttempts) {
            int needed = count - finalQuestions.size();
            QuestionResponse response = geminiService.generateQuestions(request.topic(), request.experienceLevel(),
                    needed, request.questionStyle());

            for (var q : response.questions()) {
                java.util.List<Double> vector = geminiService.embedText(q.questionText());
                double similarity = pineconeService.findHighestSimilarity(request.topic(), user.getId().toString(),
                        vector);

                if (similarity < 0.85) {
                    finalQuestions.add(q);
                    if (finalQuestions.size() == count) {
                        break;
                    }
                }
            }
            attempt++;
        }

        // Reassign IDs for frontend
        List<prepmate.interview.dto.QuestionEntry> processed = new java.util.ArrayList<>();
        for (int i = 0; i < finalQuestions.size(); i++) {
            var q = finalQuestions.get(i);
            processed.add(new prepmate.interview.dto.QuestionEntry(i + 1, q.questionText()));
        }

        return new QuestionResponse(request.topic(), request.experienceLevel(), processed);
    }

    @PostMapping("/ask-doubt")
    public AskDoubtResponse askDoubt(@RequestBody AskDoubtRequest request) {
        return geminiService.askDoubt(request.question());
    }

    @PostMapping(value = "/transcribe", consumes = { "multipart/form-data" })
    public ResponseEntity<String> transcribeAudio(@RequestParam("file") MultipartFile file) {
        String transcribedText = groqService.transcribeAudio(file);
        return ResponseEntity.ok(transcribedText);
    }

    @PostMapping(value = "/generate-from-resume", consumes = { "multipart/form-data" })
    public QuestionResponse generateQuestionsFromResume(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "resumeText", required = false) String resumeTextParam,
            @RequestParam("experienceLevel") String experienceLevel,
            @RequestParam("questionCount") int questionCount,
            @RequestParam(defaultValue = "Mixed") String questionStyle) {

        String resumeText = "";
        if (file != null && !file.isEmpty()) {
            String contentType = file.getContentType();
            String originalFilename = file.getOriginalFilename();
            if ((contentType != null && contentType.equalsIgnoreCase("application/pdf"))
                    || (originalFilename != null && originalFilename.toLowerCase().endsWith(".pdf"))) {
                try (PDDocument document = Loader.loadPDF(file.getBytes())) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    resumeText = stripper.getText(document);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to parse PDF resume file: " + e.getMessage(), e);
                }
            } else {
                try {
                    resumeText = new String(file.getBytes(), StandardCharsets.UTF_8);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read text resume file: " + e.getMessage(), e);
                }
            }
        } else if (resumeTextParam != null && !resumeTextParam.trim().isEmpty()) {
            resumeText = resumeTextParam;
        } else {
            throw new IllegalArgumentException("Either resume file or resume text must be provided.");
        }

        return geminiService.generateQuestionsFromResume(resumeText, experienceLevel, questionCount, questionStyle);
    }

    @PostMapping("/evaluate")
    public InterviewSession evaluateInterview(@RequestBody AnswerSubmission submission) {
        User user = getAuthenticatedUser();

        // 1. Run evaluation with Gemini API
        InterviewReport report = geminiService.evaluateInterview(submission);

        // 2. Map report to InterviewSession entity
        InterviewSession session = new InterviewSession();
        session.setTopic(submission.topic());
        session.setExperienceLevel(submission.experienceLevel());
        session.setOverallScore(report.overallScore());
        session.setOverallSummary(report.overallSummary());
        session.setStrengths(report.strengths());
        session.setWeaknesses(report.weaknesses());
        session.setImprovementSuggestions(report.improvementSuggestions());
        session.setUser(user);

        List<QuestionEvaluationEntity> evaluations = report.evaluations().stream()
                .map(eval -> {
                    QuestionEvaluationEntity entity = new QuestionEvaluationEntity();
                    entity.setInterviewSession(session);
                    entity.setQuestionId(eval.questionId());
                    entity.setQuestionText(eval.questionText());
                    entity.setUserAnswer(eval.userAnswer());
                    entity.setScore(eval.score());
                    entity.setFeedback(eval.feedback());
                    entity.setSuggestedAnswer(eval.suggestedAnswer());

                    // Mastery and Practice Logic (Skip for Resume Interviews)
                    boolean isResumeInterview = "Resume-Based Custom Assessment".equals(submission.topic())
                            || "Resume Based".equals(submission.topic());

                    if (!isResumeInterview) {
                        if (eval.score() >= 70) {
                            try {
                                // 1. Upsert to Pinecone
                                java.util.List<Double> vector = geminiService.embedText(eval.questionText());
                                pineconeService.upsertMasteredQuestion(submission.topic(), user.getId().toString(),
                                        eval.questionText(), vector);

                                // 2. Remove from PracticeQuestions if exists
                                practiceQuestionRepository.findByUserIdAndTopicAndFailedQuestionText(
                                        user.getId(), submission.topic(), eval.questionText())
                                        .ifPresent(practiceQuestionRepository::delete);

                                // 3. Save to MasteredQuestions for analytics
                                MasteredQuestion mq = new MasteredQuestion();
                                mq.setUser(user);
                                mq.setTopic(submission.topic());
                                mq.setQuestionText(eval.questionText());
                                mq.setMasteredAt(java.time.LocalDateTime.now());
                                masteredQuestionRepository.save(mq);
                            } catch (Exception e) {
                                // Log and skip if embedding fails
                            }
                        } else {
                            // Score < 70 -> Save to PracticeQuestions
                            PracticeQuestion pq = practiceQuestionRepository.findByUserIdAndTopicAndFailedQuestionText(
                                    user.getId(), submission.topic(), eval.questionText())
                                    .orElse(new PracticeQuestion());

                            pq.setUser(user);
                            pq.setTopic(submission.topic());
                            pq.setFailedQuestionText(eval.questionText());
                            pq.setLastScore(eval.score());
                            pq.setNextPracticeDate(java.time.LocalDateTime.now().plusDays(1)); // Spaced repetition: try
                                                                                               // again tomorrow
                            pq.setConsecutiveFailures(pq.getConsecutiveFailures() + 1);

                            practiceQuestionRepository.save(pq);
                        }
                    }

                    return entity;
                })
                .collect(Collectors.toList());

        session.setEvaluations(evaluations);

        // 3. Persist to database
        return interviewSessionRepository.save(session);
    }

    @PostMapping("/practice-generate")
    public QuestionResponse generatePracticeQuestions() {
        User user = getAuthenticatedUser();
        List<PracticeQuestion> weakQuestions = practiceQuestionRepository
                .findTop3ByUserIdAndNextPracticeDateLessThanEqualOrderByLastScoreAsc(
                        user.getId(), java.time.LocalDateTime.now());
        return geminiService.generatePracticeQuestions(weakQuestions);
    }

    @GetMapping("/mastered-questions")
    public org.springframework.data.domain.Page<MasteredQuestion> getMasteredQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String topic) {
        User user = getAuthenticatedUser();
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        if (topic != null && !topic.isEmpty()) {
            return masteredQuestionRepository.findByUserIdAndTopicOrderByMasteredAtDesc(user.getId(), topic, pageable);
        } else {
            return masteredQuestionRepository.findByUserIdOrderByMasteredAtDesc(user.getId(), pageable);
        }
    }

    @GetMapping("/history")
    public List<InterviewHistorySummary> getInterviewHistory() {
        User user = getAuthenticatedUser();
        return interviewSessionRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(session -> new InterviewHistorySummary(
                        session.getId(),
                        session.getTopic(),
                        session.getExperienceLevel(),
                        session.getOverallScore(),
                        session.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<InterviewSession> getInterviewHistoryDetail(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        return interviewSessionRepository.findById(id)
                .map(session -> {
                    if (session.getUser() != null && !session.getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(403).<InterviewSession>build();
                    }
                    return ResponseEntity.ok(session);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
