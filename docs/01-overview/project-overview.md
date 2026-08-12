# Project Overview

PrepMate is an intelligent AI Interview Coach designed to help candidates prepare for technical interviews. It generates tailored questions using Google Gemini and evaluates answers.

## High Level Workflow
1. User logs in (JWT Auth).
2. User selects a topic, experience level, and question style.
3. System generates questions via Gemini API.
4. User submits answers (text or audio transcribed via Groq).
5. System evaluates the answer, gives a score (0-100), and provides feedback.
6. Weaknesses are tracked, and mastered questions (score >= 70) are embedded via Gemini and stored in Pinecone to avoid repetition.
