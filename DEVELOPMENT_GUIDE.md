# TalentScope AI Development Manual

Welcome to the developer guide for the TalentScope AI platform.


## 1. System Architecture

HireSense utilizes a Next.js frontend with TailwindCSS, and a robust FastAPI backend parser. The frontend uses Next.js proxy rewrites in development, and serverless functions handle API endpoints in Vercel.


## 2. Fastapi API Endpoints

The backend supports /api/analyze for NLP parsing, /api/optimize-bullets for bullet re-writing, and /api/create-order for payments.


## 3. Frontend Routing Guide

Contains layout routes for dashboard, job hunt, analytics, and settings.


## 4. Local Storage Caching Strategy

Persists resume meta, analysis status, active plan metrics, and credentials cleanly.


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


## 11. Dynamic Analytics Graphics

Renders skill metrics dynamically from parsed local state.


## 12. Profile Claim workflows

Synchronizes saved data profiles and claims free allowances on mount.


## 13. Troubleshooting & FAQ

Covers server dependency resolutions, venv activation (.\\venv\\Scripts\\Activate.ps1), requirements installation, and deployment pipeline fixes.


## 14. License & Contribution Guidelines

TalentScope AI is licensed under standard developer terms.


## 15. Credits Reset and Purchase Workflows

Upon account creation, users are allocated 400 credits. The app utilizes a one-time migration (user_credits_reset_v2) to cleanly handle legacy accounts, while standard payment workflows remain operational.