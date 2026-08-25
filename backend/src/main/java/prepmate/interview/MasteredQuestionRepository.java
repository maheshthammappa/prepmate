package prepmate.interview;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MasteredQuestionRepository extends JpaRepository<MasteredQuestion, Long> {

    Page<MasteredQuestion> findByUserIdOrderByMasteredAtDesc(Long userId, Pageable pageable);
    Page<MasteredQuestion> findByUserIdAndTopicOrderByMasteredAtDesc(Long userId, String topic, Pageable pageable);
}
