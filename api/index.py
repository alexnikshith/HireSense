import os
import sys

# Ensure the 'api' directory is in the path for module discovery
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import razorpay
import httpx

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

app = FastAPI(title="Talent Scope AI API")

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
    
    if not key_secret or key_secret == "YOUR_TEST_KEY_SECRET_HERE":
        # Fallback to test mode sandbox order to keep user experience seamless
        import uuid
        return {"order_id": f"order_mock_{uuid.uuid4().hex[:12]}", "is_mock": True}
        
    client = razorpay.Client(auth=(key_id, key_secret))
    data = {
        "amount": request.amount,
        "currency": request.currency,
        "receipt": "receipt_1"
    }
    
    try:
        order = client.order.create(data=data)
        return {"order_id": order["id"], "is_mock": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay Error: {str(e)}")

@app.get("/api/jobs")
async def get_jobs(query: str = "developer", page: int = 1):
    api_key = os.environ.get("RAPIDAPI_KEY", "a2d890f645msh65618c24be3cc31p1764cejsn076bb0815ce6")
    if api_key == "YOUR_RAPIDAPI_KEY":
        raise HTTPException(status_code=500, detail="RapidAPI Key not configured in backend!")
        
    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {"query": query, "page": str(page), "num_pages": "1"}
    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(url, headers=headers, params=querystring)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"JSearch API Error: {e.response.text}")
        except Exception as e:
            err_msg = str(e) if str(e) else repr(e)
            raise HTTPException(status_code=500, detail=f"Failed to fetch jobs: {err_msg}")

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

class OptimizeBulletsRequest(BaseModel):
    bullets: list[str]

@app.post("/api/optimize-bullets")
async def optimize_bullets(request: OptimizeBulletsRequest):
    optimized = []
    weak_verbs = {"worked", "helped", "assisted", "did", "made", "got", "had", "used", "tried", "went", "handled", "dealt", "involved", "responsible", "participated", "contributed"}
    
    verb_mappings = {
        "worked": ["Implemented", "Architected", "Spearheaded"],
        "helped": ["Collaborated on", "Facilitated", "Partnered in"],
        "assisted": ["Coordinated", "Supported", "Managed"],
        "did": ["Executed", "Engineered", "Launched"],
        "made": ["Designed", "Created", "Formulated"],
        "got": ["Acquired", "Obtained", "Secured"],
        "had": ["Possessed", "Maintained", "Directed"],
        "used": ["Leveraged", "Utilized", "Deployed"],
        "handled": ["Orchestrated", "Steered", "Managed"],
        "responsible": ["Led", "Spearheaded", "Directed"],
        "participated": ["Collaborated on", "Engaged in", "Partnered in"],
        "contributed": ["Enhanced", "Bolstered", "Optimized"]
    }
    
    for bullet in request.bullets:
        bullet = bullet.strip()
        if not bullet:
            continue
            
        words = bullet.split()
        first_word = words[0].lower().rstrip(",") if words else ""
        
        is_weak = first_word in weak_verbs
        has_metrics = any(char.isdigit() for char in bullet)
        
        status = "strong"
        reason = "Excellent bullet point! Uses a strong action verb and includes key metrics."
        suggestions = []
        
        if is_weak or not has_metrics:
            status = "weak"
            reasons = []
            if is_weak:
                reasons.append(f"Uses a weak starting verb '{first_word}'")
            if not has_metrics:
                reasons.append("Lacks quantifiable metrics/numbers (e.g. %, $, or size of impact)")
            reason = " and ".join(reasons) + "."
            
            mapped_verbs = verb_mappings.get(first_word, ["Engineered", "Optimized", "Delivered"])
            rest_of_bullet = " ".join(words[1:]) if len(words) > 1 else "critical features"
            
            # Suggestion 1: Strong verb + Metric
            suggestions.append(f"{mapped_verbs[0]} {rest_of_bullet}, resulting in a 25% efficiency improvement.")
            # Suggestion 2: Advanced architectural/business focus
            suggestions.append(f"{mapped_verbs[1]} {rest_of_bullet} across cross-functional teams, serving over 5,000 users.")
            
        optimized.append({
            "original": bullet,
            "status": status,
            "reason": reason,
            "suggestions": suggestions
        })
        
    return {"optimized": optimized}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
