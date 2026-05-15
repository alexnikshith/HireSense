"""
Resume Intelligence System — FastAPI Backend
"""
import io
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from modules.parser import ResumeParser
from modules.nlp_engine import NLPEngine
from modules.matcher import JobMatcher
from modules.scorer import ATSScorer
from modules.suggestions import SuggestionsEngine

app = FastAPI(
    title="Resume Intelligence System API",
    description="ATS Resume Analyzer with NLP matching and smart suggestions",
    version="1.0.0",
)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Module singletons
parser = ResumeParser()
nlp = NLPEngine()
matcher = JobMatcher()
scorer = ATSScorer()
suggester = SuggestionsEngine()


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    return {"status": "ok", "service": "Resume Intelligence System"}


# ---------------------------------------------------------------------------
# Main analysis endpoint
# ---------------------------------------------------------------------------

@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(..., description="PDF resume file"),
    job_description: str = Form(..., description="Job description text"),
):
    """
    Full resume analysis pipeline.
    Accepts a PDF resume + job description text.
    Returns comprehensive analysis JSON.
    """
    # Validate file type
    if not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    if len(job_description.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Job description must be at least 50 characters.",
        )

    # Read PDF bytes
    pdf_bytes = await resume.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Empty PDF file.")

    try:
        # --- Step 1: Parse PDF ---
        parsed = parser.parse(pdf_bytes)

        if parsed["word_count"] < 30:
            raise HTTPException(
                status_code=422,
                detail=(
                    "Could not extract sufficient text from this PDF. "
                    "It may be scanned or image-based. "
                    "Please use a text-selectable PDF."
                ),
            )

        # --- Step 2: NLP Analysis ---
        nlp_data = nlp.analyze(parsed["cleaned_text"], parsed["sections"])

        # --- Step 3: Job Matching ---
        match_data = matcher.match(
            parsed["cleaned_text"],
            job_description,
            nlp_data["skills"],
        )

        # --- Step 4: ATS Scoring ---
        ats_data = scorer.score(parsed, nlp_data, match_data)

        # --- Step 5: Smart Suggestions ---
        suggestions = suggester.generate(
            parsed, nlp_data, match_data, ats_data, job_description
        )

        # --- Build response ---
        return JSONResponse(
            content={
                "status": "success",
                "resume_meta": {
                    "filename": resume.filename,
                    "page_count": parsed["page_count"],
                    "word_count": parsed["word_count"],
                    "has_tables": parsed["has_tables"],
                    "has_images": parsed["has_images"],
                },
                "ats": {
                    "overall_score": ats_data["overall_score"],
                    "grade": ats_data["grade"],
                    "dimensions": ats_data["dimensions"],
                    "section_feedback": ats_data["section_feedback"],
                    "formatting_issues": ats_data["formatting_issues"],
                },
                "matching": {
                    "match_score": match_data["match_score"],
                    "matching_keywords": match_data["matching_keywords"],
                    "missing_keywords": match_data["missing_keywords"],
                    "job_skills": match_data["job_skills"],
                    "keyword_density": match_data["keyword_density"],
                },
                "profile": {
                    "skills": nlp_data["skills"],
                    "technical_skills": nlp_data["technical_skills"],
                    "soft_skills": nlp_data["soft_skills"],
                    "education": nlp_data["education"],
                    "experience_years": nlp_data["experience_years"],
                    "action_verb_score": nlp_data["action_verb_score"],
                    "quantification_score": nlp_data["quantification_score"],
                    "bullet_count": len(nlp_data["bullet_points"]),
                    "weak_bullet_count": len(nlp_data["weak_bullets"]),
                },
                "suggestions": suggestions,
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}",
        )


# ---------------------------------------------------------------------------
# Multi-JD comparison endpoint
# ---------------------------------------------------------------------------

@app.post("/compare")
async def compare_jobs(
    resume: UploadFile = File(...),
    job_descriptions: str = Form(..., description="Newline-separated job descriptions"),
):
    """Compare a resume against multiple job descriptions."""
    pdf_bytes = await resume.read()
    jds = [j.strip() for j in job_descriptions.split("---") if len(j.strip()) > 50]

    if not jds:
        raise HTTPException(status_code=400, detail="No valid job descriptions provided. Separate them with '---'.")

    try:
        parsed = parser.parse(pdf_bytes)
        nlp_data = nlp.analyze(parsed["cleaned_text"], parsed["sections"])

        comparisons = []
        for i, jd in enumerate(jds[:5]):  # max 5 JDs
            m = matcher.match(parsed["cleaned_text"], jd, nlp_data["skills"])
            comparisons.append({
                "job_index": i + 1,
                "match_score": m["match_score"],
                "matching_keywords": m["matching_keywords"][:10],
                "missing_keywords": m["missing_keywords"][:10],
                "snippet": jd[:120] + "…",
            })

        comparisons.sort(key=lambda x: x["match_score"], reverse=True)
        return {"status": "success", "comparisons": comparisons}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
