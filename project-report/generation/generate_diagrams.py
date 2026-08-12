import zlib
import base64
import urllib.request
import os

def generate_kroki_url(plantuml_text):
    compressed = zlib.compress(plantuml_text.encode('utf-8'), 9)
    b64 = base64.urlsafe_b64encode(compressed).decode('utf-8')
    return f"https://kroki.io/plantuml/png/{b64}"

def download_diagram(url, filename):
    print(f"Downloading {filename}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    with open(filename, 'wb') as f:
        f.write(response.read())

print("Generating High-Resolution PlantUML Diagrams for PrepMate...")

# Common high-res skinparams
COMMON_STYLE = """
skinparam dpi 300
skinparam defaultFontName Arial
skinparam roundcorner 10
skinparam shadowing false
skinparam ArrowColor #2c3e50
skinparam NoteBackgroundColor #f1c40f
skinparam NoteBorderColor #f39c12
"""

arch = "@startuml\n" + COMMON_STYLE + """
skinparam componentStyle rectangle
skinparam backgroundColor #fdfdfd

package "Presentation Tier (React 19)" {
  [React Router] --> [Auth Context]
  [Auth Context] --> [Axios Interceptor]
  [Axios Interceptor] --> [Interview Dashboard UI]
  [Axios Interceptor] --> [Resume Upload UI]
}

package "Business Logic Tier (Spring Boot 4.1)" {
  [Spring Security Filter]
  [AuthController]
  [InterviewController]
  [PDFBox Extraction Service]
  [Gemini AI Service]
  [Pinecone Vector Service]
}

package "Data Access Tier" {
  database "PostgreSQL 14" {
    [Users Table]
    [Sessions Table]
  }
  database "Pinecone DB" {
    [Vector Embeddings]
  }
}

package "External AI Services" {
  [Google Gemini API]
  [Groq Whisper API]
}

[Axios Interceptor] ..> [Spring Security Filter] : "HTTP/REST (JWT)"
[Spring Security Filter] --> [AuthController]
[Spring Security Filter] --> [InterviewController]

[InterviewController] --> [PDFBox Extraction Service]
[InterviewController] --> [Gemini AI Service]
[InterviewController] --> [Pinecone Vector Service]
[InterviewController] --> [Groq Whisper API] : "Audio Stream"

[AuthController] --> [Users Table] : "JPA"
[InterviewController] --> [Sessions Table] : "JPA"
[Pinecone Vector Service] --> [Vector Embeddings] : "Cosine Similarity"
[Gemini AI Service] --> [Google Gemini API] : "Prompt Payload"
@enduml
"""

uc = "@startuml\n" + COMMON_STYLE + """
skinparam packageStyle rectangle
skinparam usecaseBackgroundColor #ecf0f1
skinparam usecaseBorderColor #34495e
skinparam actorStyle awesome

actor "Candidate" as user
actor "Google Gemini" as gemini
actor "Groq Whisper" as groq
actor "Pinecone DB" as pinecone

rectangle "PrepMate System" {
  usecase "Register/Login" as UC1
  usecase "Upload PDF Resume" as UC2
  usecase "Start Mock Interview" as UC3
  usecase "Generate Technical Question" as UC4
  usecase "Submit Voice Answer" as UC5
  usecase "Transcribe Audio to Text" as UC6
  usecase "Evaluate Answer & Score" as UC7
  usecase "Track Concept Mastery" as UC8
}

user --> UC1
user --> UC2
user --> UC3
user --> UC5

UC2 ..> UC3 : <<includes>>
UC3 --> UC4
UC4 --> gemini : Contextual Prompt
UC5 ..> UC6 : <<includes>>
UC6 --> groq : Binary WebM Audio
UC6 ..> UC7 : <<includes>>
UC7 --> gemini : Semantic Scoring (0-100)
UC7 ..> UC8 : <<includes>>
UC8 --> pinecone : Spaced Repetition Embeddings
@enduml
"""

cls = "@startuml\n" + COMMON_STYLE + """
skinparam classAttributeIconSize 0
skinparam classBackgroundColor #ecf0f1
skinparam classBorderColor #2980b9

class UserEntity <<Entity>> {
  - id: Long
  - email: String
  - passwordHash: String
  - role: String
  + getAuthorities(): Collection
  + getPassword(): String
}

class InterviewSession <<Entity>> {
  - id: Long
  - userId: Long
  - resumeContext: String
  - createdAt: Timestamp
  + getResumeContext(): String
}

class InterviewController <<RestController>> {
  - geminiService: GeminiService
  - pineconeService: PineconeService
  + generateQuestion(sessionId: Long): QuestionDTO
  + evaluateAnswer(sessionId: Long, answer: String): EvaluationDTO
}

class GeminiService <<Service>> {
  - apiKey: String
  - restTemplate: RestTemplate
  + buildPrompt(resumeContext: String): String
  + fetchCompletion(payload: JSON): JSON
}

class PineconeService <<Service>> {
  - pineconeClient: Client
  - indexName: String
  + upsertVector(questionText: String, score: int)
  + searchSimilar(topic: String): List<String>
}

InterviewController --> GeminiService : "injects"
InterviewController --> PineconeService : "injects"
UserEntity "1" *-- "0..*" InterviewSession : "owns"
@enduml
"""

seq = "@startuml\n" + COMMON_STYLE + """
actor Candidate
participant "React SPA" as UI
participant "InterviewController" as API
participant "GeminiService" as Gemini
participant "PineconeService" as Pinecone
participant "External APIs" as External

Candidate -> UI : Speaks Answer
UI -> API : POST /api/evaluate {audioBlob}
activate API
API -> API : Parse & Transcribe (Groq)
API -> Gemini : evaluate(context, transcribedText)
activate Gemini
Gemini -> External : POST prompt payload
activate External
External --> Gemini : JSON {score: 85, modelAnswer: "..."}
deactivate External
Gemini -> Pinecone : embed & upsert(question) (if score >= 70)
activate Pinecone
Pinecone --> Gemini : ACK
deactivate Pinecone
Gemini --> API : EvaluationDTO (Score, Feedback)
deactivate Gemini
API --> UI : HTTP 200 OK {EvaluationDTO}
deactivate API
UI --> Candidate : Displays Score & Feedback
@enduml
"""

act = "@startuml\n" + COMMON_STYLE + """
start
:Candidate Submits Answer;
:Score Answer via Gemini API;
if (Score >= 70?) then (yes)
  :Convert Question to Vector;
  :Store in Pinecone DB;
  :Mark as Mastered;
else (no)
  :Add Question to Weakness Queue;
endif
:Check Weakness Queue;
if (Is Queue Empty?) then (no)
  :Resurface Weak Concept;
else (yes)
  :Check Pinecone DB;
  if (Similarity > 0.8?) then (yes)
    :Generate New Topic;
  else (no)
    :Generate Next Question;
  endif
endif
stop
@enduml
"""

er = "@startuml\n" + COMMON_STYLE + """
hide circle
skinparam linetype ortho
skinparam classBackgroundColor #f8f9fa
skinparam classBorderColor #343a40

entity "users" as u {
  * id : BIGINT <<PK>>
  --
  * email : VARCHAR(255) <<UQ>>
  * password : VARCHAR(255)
  * role : VARCHAR(50)
}

entity "sessions" as s {
  * id : BIGINT <<PK>>
  --
  * user_id : BIGINT <<FK>>
  resume_context : TEXT
  * created_at : TIMESTAMP
}

entity "question_history" as qh {
  * id : BIGINT <<PK>>
  --
  * session_id : BIGINT <<FK>>
  * question_text : TEXT
  * user_answer : TEXT
  * score : INT
  * is_mastered : BOOLEAN
}

entity "practice_questions" as pq {
  * id : BIGINT <<PK>>
  --
  * user_id : BIGINT <<FK>>
  * topic : VARCHAR(255)
  * failedQuestionText : TEXT
  * lastScore : INT
  * nextPracticeDate : TIMESTAMP
  * consecutiveFailures : INT
}

package "Pinecone Vector DB (NoSQL)" <<Database>> {
  entity "question_embeddings" as pinecone {
    * id : VARCHAR <<Vector ID>>
    --
    * values : FLOAT[1536] <<Embedding>>
    -- metadata --
    * user_id : BIGINT
    * topic : VARCHAR
    * type : VARCHAR
  }
}

u ||..o{ s
s ||..o{ qh
u ||..o{ pq

' Logical relationship to Pinecone
qh ..> pinecone : "Embeds into"
pq ..> pinecone : "Embeds into"
@enduml
"""

diagrams = {
    "sequence.png": seq,
    "er.png": er
}

for filename, text in diagrams.items():
    url = generate_kroki_url(text)
    download_diagram(url, os.path.join(os.path.dirname(__file__), filename))
    
print("All high-res diagrams downloaded successfully.")
