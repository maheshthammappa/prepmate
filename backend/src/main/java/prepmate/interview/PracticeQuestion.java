package prepmate.interview;

import jakarta.persistence.*;
import prepmate.auth.User;
import java.time.LocalDateTime;

@Entity
@Table(name = "practice_questions")
public class PracticeQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String topic;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String failedQuestionText;

    @Column(nullable = false)
    private int lastScore;

    @Column(nullable = false)
    private LocalDateTime nextPracticeDate;

    @Column(nullable = false)
    private int consecutiveFailures;

    public PracticeQuestion() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getFailedQuestionText() {
        return failedQuestionText;
    }

    public void setFailedQuestionText(String failedQuestionText) {
        this.failedQuestionText = failedQuestionText;
    }

    public int getLastScore() {
        return lastScore;
    }

    public void setLastScore(int lastScore) {
        this.lastScore = lastScore;
    }

    public LocalDateTime getNextPracticeDate() {
        return nextPracticeDate;
    }

    public void setNextPracticeDate(LocalDateTime nextPracticeDate) {
        this.nextPracticeDate = nextPracticeDate;
    }

    public int getConsecutiveFailures() {
        return consecutiveFailures;
    }

    public void setConsecutiveFailures(int consecutiveFailures) {
        this.consecutiveFailures = consecutiveFailures;
    }
}
