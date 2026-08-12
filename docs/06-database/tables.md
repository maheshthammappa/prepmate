# Tables
- `users`: id, username, email, password, bio, created_at
- `interview_sessions`: id, user_id, topic, experience_level, overall_score, overall_summary, created_at
- `question_evaluations`: id, session_id, question_id, question_text, user_answer, score, feedback, suggested_answer
- `practice_questions`: id, user_id, topic, failed_question_text, last_score, next_practice_date, consecutive_failures
- `mastered_questions`: id, user_id, question_text, topic, mastered_at
- Collections: `session_strengths`, `session_weaknesses`, `session_improvements`
