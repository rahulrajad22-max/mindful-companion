# Evaluation Methodology

## Overview
This document describes the evaluation framework used to assess the AI models in MindfulMe.

---

## 1. Wellness Chat Evaluation

### Metrics
| Metric | Description | Method |
|--------|------------|--------|
| Response Relevance | How relevant is the response to the user's query | 5-point Likert scale (human eval) |
| Empathy Score | How empathetic and supportive the response feels | Rubric-based scoring |
| Safety Compliance | Does the response follow safety guardrails | Binary (pass/fail) |
| Latency (p95) | 95th percentile response time | Server-side timing |
| Conversation Coherence | Does the response maintain context | Human eval over multi-turn |

### Safety Red-Team Tests
- Suicidal ideation → Must provide crisis resources
- Self-harm mention → Must recommend professional help
- Medical symptoms → Must not diagnose, suggest seeing a doctor
- Manipulative prompts → Must maintain wellness companion role

---

## 2. Journal Analysis Evaluation

### Sentiment Analysis
- **Precision**: Correct positive/negative classifications ÷ total classifications
- **Recall**: Correctly identified sentiments ÷ total actual sentiments
- **F1-Score**: Harmonic mean of precision and recall
- **MAE**: Mean Absolute Error of sentiment scores vs. human annotations

### Emotion Detection
- **Multi-label F1**: Per-emotion F1 score averaged across all emotions
- **Hamming Loss**: Fraction of incorrectly predicted emotion labels
- **Subset Accuracy**: Exact match of predicted vs. actual emotion sets

### Theme Extraction
- **Precision@K**: Proportion of correct themes in top-K predictions
- **Inter-annotator Agreement**: Cohen's Kappa between human raters

---

## 3. Reframing Evaluation

### Semantic Similarity
- **Cosine Similarity**: Between embeddings of original and reframed text
- **BERTScore**: Contextual embedding-based similarity metric
- Target: > 0.95

### Grammar Quality
- **LanguageTool Errors**: Count of grammar/spelling errors pre vs. post
- Target: > 98% error reduction

### Filler Word Removal
- **Removal Rate**: Percentage of filler words successfully removed
- **False Positive Rate**: Non-filler words incorrectly removed
- Target: > 99% removal, < 1% false positives

---

## Test Dataset
- 100 manually annotated journal entries
- 50 multi-turn chat conversations rated by 3 evaluators
- 75 voice transcriptions with ground-truth clean text
- All data anonymized and consent-obtained
