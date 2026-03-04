# API Reference

## Edge Functions

### 1. POST `/functions/v1/wellness-chat`

**Description**: Streaming conversational AI for mental wellness support.

**Request**:
```json
{
  "messages": [
    { "role": "user", "content": "I'm feeling anxious today" },
    { "role": "assistant", "content": "I hear you..." },
    { "role": "user", "content": "Can you help me with breathing?" }
  ]
}
```

**Headers**:
| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Authorization | Bearer {ANON_KEY} |

**Response**: `text/event-stream` (SSE)
```
data: {"choices":[{"delta":{"content":"I"}}]}
data: {"choices":[{"delta":{"content":" hear"}}]}
data: {"choices":[{"delta":{"content":" you"}}]}
data: [DONE]
```

**Error Responses**:
| Status | Body | Meaning |
|--------|------|---------|
| 429 | `{"error": "Rate limit exceeded..."}` | Too many requests |
| 402 | `{"error": "AI credits exhausted..."}` | Billing issue |
| 500 | `{"error": "AI service error"}` | Gateway failure |

---

### 2. POST `/functions/v1/analyze-journal`

**Description**: Analyzes a journal entry for sentiment, emotions, and themes.

**Request**:
```json
{
  "journalEntry": "Today was a really tough day...",
  "mood": "sad"
}
```

**Response**: `application/json`
```json
{
  "analysis": {
    "sentiment_score": 0.35,
    "emotions": ["sadness", "frustration"],
    "themes": ["work", "relationships"],
    "suggestions": [
      "Try a 10-minute walk to clear your mind",
      "Write down 3 things you're grateful for"
    ],
    "summary": "The entry reflects a challenging day..."
  }
}
```

---

### 3. POST `/functions/v1/reframe-text`

**Description**: Cleans up voice-to-text transcriptions into polished journal text.

**Request**:
```json
{
  "text": "Um so today was like really stressful you know..."
}
```

**Response**: `application/json`
```json
{
  "reframed": "Today was really stressful..."
}
```

---

### 4. POST `/functions/v1/translate-text`

**Description**: Translates text between supported Indian languages.

**Request**:
```json
{
  "text": "How are you feeling today?",
  "targetLanguage": "hi"
}
```

**Response**: `application/json`
```json
{
  "translated": "आज आप कैसा महसूस कर रहे हैं?"
}
```

---

## Supported Languages

| Code | Language | Script |
|------|----------|--------|
| en | English | Latin |
| hi | Hindi | Devanagari |
| ta | Tamil | Tamil |
| te | Telugu | Telugu |
| kn | Kannada | Kannada |
| ml | Malayalam | Malayalam |
| bn | Bengali | Bengali |
| mr | Marathi | Devanagari |
| gu | Gujarati | Gujarati |
| pa | Punjabi | Gurmukhi |

---

## Authentication

All endpoints accept the Supabase anon key as Bearer token. User-specific endpoints additionally validate the JWT from the Authorization header to extract `auth.uid()`.

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| wellness-chat | Gateway-managed |
| analyze-journal | Gateway-managed |
| reframe-text | Gateway-managed |
