package prepmate.interview.dto;

public record AnswerEntry(
    int questionId,
    String questionText,
    String userAnswer
) {}
