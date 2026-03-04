# 🧠 Models & AI Pipeline — MindfulMe

This document describes the AI/ML models integrated into the MindfulMe wellness platform, their configurations, training approach, and usage across features.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Models Used](#models-used)
3. [Model Configurations](#model-configurations)
4. [Data Pipeline](#data-pipeline)
5. [Evaluation Metrics](#evaluation-metrics)
6. [API Integration](#api-integration)
7. [Future Improvements](#future-improvements)

---

## Architecture Overview

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Frontend   │────▶│  Edge Functions   │────▶│  AI Gateway (LLM)   │
│  (React App) │◀────│  (Deno Runtime)   │◀────│  Google Gemini /    │
│              │     │                   │     │  OpenAI Models       │
└──────────────┘     └──────────────────┘     └─────────────────────┘
        │                    │
        ▼                    ▼
┌──────────────┐     ┌──────────────────┐
│   User UI    │     │   PostgreSQL DB   │
│  Components  │     │  (Supabase)       │
└──────────────┘     └──────────────────┘
```

The platform uses a **serverless AI architecture** where:
- Frontend sends requests to **Edge Functions** (serverless backend)
- Edge Functions communicate with the **AI Gateway** to invoke LLMs
- Responses are streamed back to the user in real-time (SSE)
- Results are persisted in the database for analytics

---

## Models Used

### 1. Wellness Chat Companion
| Parameter | Value |
|-----------|-------|
| **Model** | `google/gemini-3-flash-preview` |
| **Type** | Large Language Model (LLM) |
| **Task** | Conversational AI for mental health support |
| **Architecture** | Transformer-based, Mixture of Experts |
| **Context Window** | 1M tokens |
| **Streaming** | Yes (Server-Sent Events) |
| **Temperature** | Default (balanced creativity/accuracy) |

**System Prompt Engineering:**
- Role: Empathetic wellness companion
- Constraints: Never diagnose, recommend professional help for serious concerns
- Style: Warm, concise (2-4 paragraphs), uses emojis sparingly
- Capabilities: Breathing exercises, journaling prompts, mindfulness techniques

### 2. Journal Entry Analysis
| Parameter | Value |
|-----------|-------|
| **Model** | `google/gemini-2.5-flash` |
| **Type** | Large Language Model (LLM) |
| **Task** | Sentiment analysis, emotion detection, insight generation |
| **Architecture** | Transformer-based |
| **Output Format** | Structured JSON |
| **Temperature** | 0.3 (deterministic) |

**Analysis Pipeline:**
```
Raw Journal Text → Preprocessing → LLM Analysis → JSON Parsing → DB Storage
```

**Output Schema:**
```json
{
  "sentiment_score": 0.0-1.0,
  "emotions": ["joy", "sadness", ...],
  "themes": ["work", "relationships", ...],
  "suggestions": ["...", "..."],
  "summary": "Brief insight summary"
}
```

### 3. Voice-to-Text Reframing
| Parameter | Value |
|-----------|-------|
| **Model** | `google/gemini-2.5-flash-lite` |
| **Type** | Large Language Model (LLM) |
| **Task** | Speech transcription cleanup & reframing |
| **Architecture** | Transformer-based (lightweight) |
| **Temperature** | 0.3 (conservative) |

**Processing Steps:**
1. Raw speech-to-text transcription (via ElevenLabs Scribe)
2. Filler word removal (um, uh, like, you know)
3. Grammar & punctuation correction
4. Natural sentence restructuring
5. Meaning preservation validation

### 4. Multilingual Translation
| Parameter | Value |
|-----------|-------|
| **Model** | i18next + Browser Language Detection |
| **Type** | Rule-based localization |
| **Languages** | 10 (EN, HI, TA, TE, KN, ML, BN, MR, GU, PA) |
| **Strings** | 200+ per language |
| **Detection** | Browser language → localStorage → fallback (EN) |

---

## Model Configurations

### Edge Function: `wellness-chat`
```
File: supabase/functions/wellness-chat/index.ts
Endpoint: /functions/v1/wellness-chat
Method: POST
Auth: Bearer token (anon key)
Streaming: Yes (text/event-stream)
Rate Limiting: Gateway-level (429 handling)
```

### Edge Function: `analyze-journal`
```
File: supabase/functions/analyze-journal/index.ts
Endpoint: /functions/v1/analyze-journal
Method: POST
Auth: Bearer token
Streaming: No (JSON response)
```

### Edge Function: `reframe-text`
```
File: supabase/functions/reframe-text/index.ts
Endpoint: /functions/v1/reframe-text
Method: POST
Auth: Bearer token
Streaming: No (JSON response)
```

---

## Data Pipeline

### Training Data Flow
```
User Input (Journal/Chat)
    │
    ▼
Preprocessing (Edge Function)
    │
    ▼
Model Inference (AI Gateway)
    │
    ▼
Post-processing & Validation
    │
    ▼
Storage (PostgreSQL)
    │
    ▼
Analytics & Visualization (Frontend)
```

### Database Schema for ML Data
| Table | ML-Relevant Columns |
|-------|-------------------|
| `journal_entries` | `sentiment` (float), `ai_analysis` (JSON), `mood` (string), `stress_level` (int) |
| `mood_entries` | `mood` (string), `mood_value` (int 1-5), `entry_date` (date) |
| `wellness_logs` | `sleep_hours`, `exercise_minutes`, `water_glasses` |

---

## Evaluation Metrics

### Sentiment Analysis Accuracy
| Metric | Target | Method |
|--------|--------|--------|
| Sentiment Precision | > 0.85 | Manual annotation comparison |
| Emotion F1-Score | > 0.80 | Cross-validation with labeled data |
| Theme Extraction | > 0.75 | Human expert agreement |

### Chat Quality Metrics
| Metric | Target | Method |
|--------|--------|--------|
| Response Relevance | > 4.0/5.0 | User feedback ratings |
| Empathy Score | > 4.2/5.0 | Rubric-based evaluation |
| Safety Compliance | 100% | Automated red-team testing |
| Response Latency (p95) | < 3s | Server-side monitoring |

### Reframing Quality
| Metric | Target | Method |
|--------|--------|--------|
| Meaning Preservation | > 0.95 | Semantic similarity (cosine) |
| Grammar Accuracy | > 0.98 | Automated grammar check |
| Filler Removal Rate | > 0.99 | Pattern matching validation |

---

## API Integration

### Request Flow
```typescript
// Frontend → Edge Function → AI Gateway
const response = await fetch(EDGE_FUNCTION_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ANON_KEY}`
  },
  body: JSON.stringify({ messages, journalEntry, text })
});
```

### Error Handling Strategy
| HTTP Code | Meaning | Action |
|-----------|---------|--------|
| 200 | Success | Process response |
| 402 | Credits exhausted | Notify user |
| 429 | Rate limited | Retry with backoff |
| 500 | Server error | Fallback message |

---

## Future Improvements

### Planned Enhancements
1. **Fine-tuning**: Domain-specific fine-tuning on mental health conversation datasets
2. **RAG Pipeline**: Retrieval-Augmented Generation using user's journal history for personalized responses
3. **Mood Prediction**: Time-series forecasting using historical mood data (LSTM/Transformer)
4. **Multimodal Input**: Image-based mood detection using vision models
5. **Federated Learning**: Privacy-preserving model updates from anonymized user data
6. **A/B Testing**: Systematic comparison of model variants for response quality

### Research References
- Vaswani et al. (2017) - "Attention Is All You Need" — Transformer architecture
- Brown et al. (2020) - "Language Models are Few-Shot Learners" — GPT scaling laws
- Team Gemini (2024) - "Gemini: A Family of Highly Capable Multimodal Models"
- Roller et al. (2021) - "Recipes for Building an Open-Domain Chatbot" — Empathetic dialogue

---

## Directory Structure

```
models/
├── README.md                    # This file
├── configs/
│   ├── wellness_chat.json       # Chat model configuration
│   ├── journal_analysis.json    # Analysis model configuration
│   └── reframe_text.json        # Reframing model configuration
├── prompts/
│   ├── wellness_system.md       # System prompt for chat
│   ├── analysis_system.md       # System prompt for journal analysis
│   └── reframe_system.md        # System prompt for reframing
├── evaluation/
│   ├── metrics.md               # Evaluation methodology
│   └── results.md               # Benchmark results
└── docs/
    ├── architecture.md          # Detailed architecture docs
    └── api_reference.md         # API documentation
```

---

*Last updated: March 2026*
*Project: MindfulMe — AI-Powered Mental Wellness Platform*
*Team: College Project Submission*
