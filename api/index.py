import os
import sys

# Ensure the 'api' directory is in the path for module discovery
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Absolute imports for Vercel stability
from modules.parser import ResumeParser
from modules.nlp_engine import NLPEngine
from modules.matcher import JobMatcher
from modules.scorer import ATSScorer
from modules.suggestions import SuggestionEngine

app = FastAPI(title="HireSense AI API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines once
parser = ResumeParser()
nlp = NLPEngine()
matcher = JobMatcher()
scorer = ATSScorer()
suggester = SuggestionEngine()

@app.get("/api/health")
@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.1.0"}

@app.post("/api/analyze")
@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # 1. Parse PDF
        contents = await file.read()
        resume_data = parser.parse_pdf(contents)
        
        if not resume_data["text"].strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        # 2. NLP Enrichment
        analysis = nlp.analyze(resume_data["text"], resume_data["sections"])

        # 3. Job Matching
        match_results = matcher.calculate_match(resume_data["text"], job_description)

        # 4. ATS Scoring
        scores = scorer.calculate_ats_score(
            resume_data, 
            analysis, 
            match_results,
            job_description
        )

        # 5. Generate Suggestions
        suggestions = suggester.generate_suggestions(
            resume_data,
            analysis,
            match_results,
            scores
        )

        return {
            "score": scores["total_score"],
            "dimensions": scores["dimensions"],
            "match_percentage": match_results["score"],
            "keywords_found": match_results["common_keywords"],
            "missing_keywords": match_results["missing_keywords"],
            "analysis": analysis,
            "suggestions": suggestions,
            "formatting_feedback": resume_data["formatting_issues"]
        }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(error_details)
        raise HTTPException(
            status_code=500, 
            detail=f"AI Engine Error: {str(e)}\n\nTraceback:\n{error_details}"
        )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
