import os
import sys

# Ensure the 'api' directory is in the path for module discovery
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import razorpay

# Absolute imports for Vercel stability
try:
    from modules.parser import ResumeParser
    from modules.nlp_engine import NLPEngine
    from modules.matcher import JobMatcher
    from modules.scorer import ATSScorer
    from modules.suggestions import SuggestionsEngine
except Exception as _e:
    err_msg = str(_e)
    print(f"IMPORT ERROR: {err_msg}")
    class Dummy: 
        def __getattr__(self, name): 
            raise Exception(f"Backend failed to initialize. Error: {err_msg}")
    ResumeParser = NLPEngine = JobMatcher = ATSScorer = SuggestionsEngine = Dummy

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
suggester = SuggestionsEngine()

@app.get("/api/health")
@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.2.0"}

class OrderRequest(BaseModel):
    amount: int
    currency: str = "INR"

@app.post("/api/create-order")
async def create_order(request: OrderRequest):
    key_id = os.environ.get("RAZORPAY_KEY_ID", "rzp_test_Sqi4HlmtjalojS")
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET", "YOUR_TEST_KEY_SECRET_HERE")
    
    if key_secret == "YOUR_TEST_KEY_SECRET_HERE":
        raise HTTPException(status_code=500, detail="Razorpay Secret Key not configured in backend! Please add RAZORPAY_KEY_SECRET to your environment variables.")
        
    client = razorpay.Client(auth=(key_id, key_secret))
    data = {
        "amount": request.amount,
        "currency": request.currency,
        "receipt": "receipt_1"
    }
    
    try:
        order = client.order.create(data=data)
        return {"order_id": order["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay Error: {str(e)}")

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
        match_results = matcher.match(
            resume_data["text"], 
            job_description,
            analysis["skills"]
        )

        # 4. ATS Scoring
        scores = scorer.score(
            resume_data, 
            analysis, 
            match_results
        )

        # 5. Generate Suggestions
        suggestions = suggester.generate(
            resume_data,
            analysis,
            match_results,
            scores,
            job_description
        )

        return {
            "resume_meta": {
                "filename": file.filename,
                "page_count": resume_data.get("page_count", 1),
                "has_tables": resume_data.get("has_tables", False),
                "has_images": resume_data.get("has_images", False),
                "word_count": resume_data.get("word_count", 0)
            },
            "ats": {
                "overall_score": scores["overall_score"],
                "grade": scores["grade"],
                "dimensions": scores["dimensions"],
                "formatting_issues": scores["formatting_issues"],
                "section_feedback": scores["section_feedback"]
            },
            "matching": {
                "match_score": match_results["match_score"],
                "matching_keywords": match_results["matching_keywords"],
                "missing_keywords": match_results["missing_keywords"],
                "job_skills": match_results["job_skills"],
                "resume_skills": match_results["resume_skills"]
            },
            "profile": {
                "skills": analysis["skills"],
                "experience_years": analysis["experience_years"],
                "bullet_count": len(analysis["bullet_points"]),
                "weak_bullet_count": len(analysis["weak_bullets"]),
                "technical_skills": analysis["technical_skills"],
                "soft_skills": analysis["soft_skills"],
                "action_verb_score": analysis["action_verb_score"]
            },
            "suggestions": suggestions
        }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(error_details)
        raise HTTPException(
            status_code=500, 
            detail=f"Analysis Error: {str(e)}"
        )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
