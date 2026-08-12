# Database Architecture
Uses PostgreSQL for relational data and Pinecone for vector embeddings.
Data flow goes from Controllers -> Repositories -> PostgreSQL.
Mastered question embeddings go to Pinecone for semantic similarity checks.
