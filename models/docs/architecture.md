# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React 18 + TypeScript + Tailwind CSS + Vite                │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   Chat   │ │ Journal  │ │Analytics │ │Dashboard │       │
│  │   Page   │ │   Page   │ │   Page   │ │   Page   │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │             │            │             │             │
│  ┌────▼─────────────▼────────────▼─────────────▼─────┐      │
│  │              Supabase Client SDK                   │      │
│  │         (Auth, DB Queries, Function Calls)         │      │
│  └────────────────────┬──────────────────────────────┘      │
└───────────────────────┼──────────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼──────────────────────────────────────┐
│                     BACKEND (Serverless)                      │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  wellness-chat   │  │ analyze-journal  │                   │
│  │  (Streaming SSE) │  │ (JSON Response)  │                   │
│  └────────┬────────┘  └────────┬────────┘                   │
│           │                     │                             │
│  ┌────────┴─────────────────────┴────────┐                   │
│  │         reframe-text                   │                   │
│  │         (JSON Response)                │                   │
│  └────────┬──────────────────────────────┘                   │
│           │                                                   │
│  ┌────────▼──────────────────────────────┐                   │
│  │       AI Gateway (LLM Router)          │                   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ │                   │
│  │  │Gemini 3 │ │Gemini   │ │Gemini   │ │                   │
│  │  │Flash    │ │2.5 Flash│ │2.5 Lite │ │                   │
│  │  │Preview  │ │         │ │         │ │                   │
│  │  └─────────┘ └─────────┘ └─────────┘ │                   │
│  └───────────────────────────────────────┘                   │
│                                                              │
│  ┌───────────────────────────────────────┐                   │
│  │         PostgreSQL Database            │                   │
│  │  ┌──────────┐ ┌──────────┐            │                   │
│  │  │ journal_ │ │  mood_   │            │                   │
│  │  │ entries  │ │ entries  │            │                   │
│  │  ├──────────┤ ├──────────┤            │                   │
│  │  │profiles  │ │wellness_ │            │                   │
│  │  │          │ │  logs    │            │                   │
│  │  └──────────┘ └──────────┘            │                   │
│  └───────────────────────────────────────┘                   │
│                                                              │
│  ┌───────────────────────────────────────┐                   │
│  │         Authentication (Auth)          │                   │
│  │  Email/Password + Session Management  │                   │
│  └───────────────────────────────────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI Components |
| Language | TypeScript | Type Safety |
| Styling | Tailwind CSS | Utility-first CSS |
| Build | Vite | Fast HMR & Bundling |
| State | TanStack Query | Server State Management |
| Routing | React Router v6 | Client-side Routing |
| i18n | i18next | 10-language support |
| Charts | Recharts | Data Visualization |
| Backend | Deno Edge Functions | Serverless Compute |
| Database | PostgreSQL | Relational Data |
| Auth | Supabase Auth | User Management |
| AI | Gemini Models | NLP & Generation |
| Voice | ElevenLabs | Speech-to-Text |

## Security Architecture

### Row-Level Security (RLS)
All database tables enforce RLS policies ensuring users can only access their own data:
```sql
-- Example: Users can only read their own journal entries
CREATE POLICY "Users read own entries"
ON journal_entries FOR SELECT
USING (auth.uid() = user_id);
```

### API Security
- All edge functions validate Bearer tokens
- CORS headers restrict cross-origin access
- No sensitive keys exposed to frontend
- AI Gateway handles API key management server-side

## Data Flow: Chat Feature
```
1. User types message → React state update
2. handleSend() → POST /functions/v1/wellness-chat
3. Edge function receives messages array
4. Prepends system prompt → Calls AI Gateway
5. AI Gateway → Gemini 3 Flash Preview (streaming)
6. SSE chunks → Edge function pipes through
7. Frontend reads stream → Updates UI incrementally
8. Final message stored in React state
```

## Data Flow: Journal Analysis
```
1. User writes journal entry → Saves to DB
2. User clicks "Analyze" → POST /functions/v1/analyze-journal
3. Edge function receives journal text + mood
4. Calls AI Gateway → Gemini 2.5 Flash
5. Returns structured JSON analysis
6. Frontend displays sentiment, emotions, themes
7. Analysis stored in journal_entries.ai_analysis column
```
