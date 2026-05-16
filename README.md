# HireSense: AI-Powered Resume Intelligence System

HireSense is a premium AI-powered SaaS platform designed to help candidates optimize their resumes for Applicant Tracking Systems (ATS) and land more interviews.

Using a combination of **FastAPI**, **NLP (spaCy)**, and **Next.js 14**, HireSense provides recruiter-level insights, skill gap analysis, and smart suggestions in a beautiful, minimalist dashboard.

## 📸 Preview

*SaaS Landing Page and Intelligence Dashboard*
*(Screenshots coming soon)*

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Glassmorphism
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Framework**: FastAPI (Python)
- **NLP**: Custom engine using spaCy & Scikit-learn
- **PDF Parsing**: pdfminer.six
- **API**: RESTful architecture

## 🏗️ Architecture

HireSense follows a modern monorepo-style architecture:
- **`/src`**: Next.js 14 frontend handling the user interface and analytics visualization.
- **`/api`**: FastAPI backend exposing the core NLP and analysis endpoints.
- **`/api/modules`**: Modular Python engines for parsing, matching, and scoring.

## 🧠 Core Engine Modules

- **`parser.py`**: Extracts text and sections from complex PDF structures.
- **`nlp_engine.py`**: Enriches text data with entity detection and skill extraction.
- **`matcher.py`**: Computes semantic similarity between resumes and job descriptions.
- **`scorer.py`**: Weighted algorithm for multi-dimensional ATS scoring.
- **`suggestions.py`**: Rule-based engine for actionable resume improvements.

## ✨ Features

- **ATS Compatibility Scoring**: Instant feedback on how well your resume is optimized for automated systems.
- **Skill Gap Analysis**: Intelligence layer that highlights exactly which keywords are missing from your profile.
- **Hiring Readiness Radar**: Multi-dimensional visualization of formatting, keywords, and action verbs.
- **Smart Rewrites**: AI-powered suggestions to transform weak bullet points into high-impact achievements.
- **Modern SaaS Dashboard**: A premium, glassmorphism-based interface for managing your career assets.

## 🚀 Getting Started

### 1. Backend Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn api.index:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🛤️ Roadmap

- [ ] Multi-resume comparison tool
- [ ] Integration with LinkedIn API for profile synchronization
- [ ] Real-time interview simulation based on resume gaps
- [ ] Enterprise dashboard for recruiters and HR teams
- [ ] Browser extension for one-click job description analysis

---

Built with ❤️ by Nikshith Gurram

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
