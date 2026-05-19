# HireSense Development Manual

Welcome to the developer guide for the HireSense AI platform.


## 1. System Architecture

HireSense utilizes a Next.js frontend with TailwindCSS, and a robust FastAPI backend parser.


## 2. Fastapi API Endpoints

The backend supports /api/analyze for NLP parsing and /api/create-order for payments.


## 3. Frontend Routing Guide

Contains layout routes for dashboard, job hunt, analytics, and settings.


## 4. Local Storage Caching Strategy

Persists resume meta, analysis status, and credentials cleanly.


## 5. ATS Scoring Algorithm

Computes matches based on word density, keyword matching, and readability index.


## 6. Suggestions Engine Rules

Provides priority actions for improving resume formatting and spelling.


## 7. NLP Tokenization Architecture

Utilizes custom scanners to tokenize resumes and identify matching fields.


## 8. Job Matching Similarity Index

Calculates cosine similarity between parsed resumes and target descriptions.


## 9. RapidAPI JSearch Integration

Queries live Indian and Global developer roles based on user filters.


## 10. Razorpay Standard Checkout

Uses client-side standard overlay checkouts for reliable Sandbox/Live test mode.
