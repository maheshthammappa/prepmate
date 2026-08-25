package prepmate.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PracticeQuestionRepository extends JpaRepository<PracticeQuestion, Long> {

    List<PracticeQuestion> findTop3ByUserIdAndNextPracticeDateLessThanEqualOrderByLastScoreAsc(Long userId, LocalDateTime currentTime);

    Optional<PracticeQuestion> findByUserIdAndTopicAndFailedQuestionText(Long userId, String topic, String failedQuestionText);
}
