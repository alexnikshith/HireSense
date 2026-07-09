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
import sqlite3

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

# Initialize Database
DATABASE_URL = os.environ.get("DATABASE_URL")

class Database:
    def __init__(self):
        self.is_postgres = DATABASE_URL is not None and DATABASE_URL.startswith("postgres")
        if self.is_postgres:
            # Postgres SSL handling for safe cloud environments
            self.conn_str = DATABASE_URL
            if "sslmode" not in self.conn_str:
                if "?" in self.conn_str:
                    self.conn_str += "&sslmode=require"
                else:
                    self.conn_str += "?sslmode=require"
        else:
            if os.environ.get("VERCEL"):
                self.db_file = "/tmp/users.db"
            else:
                self.db_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "users.db")

    def get_connection(self):
        if self.is_postgres:
            import psycopg2
            return psycopg2.connect(self.conn_str)
        else:
            return sqlite3.connect(self.db_file)

    def execute(self, query: str, params=()):
        conn = self.get_connection()
        cursor = conn.cursor()
        if self.is_postgres:
            query = query.replace("?", "%s")
        cursor.execute(query, params)
        conn.commit()
        conn.close()

    def fetchone(self, query: str, params=()):
        conn = self.get_connection()
        cursor = conn.cursor()
        if self.is_postgres:
            query = query.replace("?", "%s")
        cursor.execute(query, params)
        row = cursor.fetchone()
        conn.close()
        return row

db = Database()

def init_db():
    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            password TEXT,
            credits INTEGER DEFAULT 400,
            active_plan TEXT DEFAULT 'free'
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS email_credentials (
            username TEXT PRIMARY KEY,
            email_address TEXT,
            app_password TEXT,
            imap_server TEXT DEFAULT 'imap.gmail.com'
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS oauth_tokens (
            username TEXT PRIMARY KEY,
            access_token TEXT,
            refresh_token TEXT,
            expires_at INTEGER
        )
    """)
    # Seed default user if not exists
    user = db.fetchone("SELECT 1 FROM users WHERE username = ?", ("nikshith",))
    if not user:
        db.execute(
            "INSERT INTO users (username, email, password, credits, active_plan) VALUES (?, ?, ?, ?, ?)",
            ("nikshith", "nikshith@example.com", "1234567890", 400, "free")
        )

init_db()

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

class UpdateUserRequest(BaseModel):
    username: str
    credits: int
    active_plan: str

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
class Dummy:
    def __getattr__(self, name):
        raise Exception("Backend initialization failed.")
try:
    suggester = SuggestionsEngine()
except Exception:
    suggester = Dummy()

@app.post("/api/auth/signup")
async def auth_signup(req: SignupRequest):
    username = req.username.strip()
    email = req.email.strip().lower()
    
    # Check duplicate username/email
    existing_user = db.fetchone("SELECT 1 FROM users WHERE LOWER(username) = ?", (username.lower(),))
    existing_email = db.fetchone("SELECT 1 FROM users WHERE LOWER(email) = ?", (email,))
    
    if existing_user or existing_email:
        raise HTTPException(status_code=400, detail="Username or email already exists.")
        
    db.execute(
        "INSERT INTO users (username, email, password, credits, active_plan) VALUES (?, ?, ?, ?, ?)",
        (username, email, req.password, 400, "free")
    )
    return {"status": "success", "username": username, "email": email}

@app.post("/api/auth/login")
async def auth_login(req: LoginRequest):
    username_or_email = req.username_or_email.strip().lower()
    user = db.fetchone(
        "SELECT username, email, password, credits, active_plan FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?",
        (username_or_email, username_or_email)
    )
    
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist.")
    
    db_username, db_email, db_password, db_credits, db_active_plan = user
    if req.password != db_password:
        raise HTTPException(status_code=400, detail="Incorrect password.")
        
    return {
        "status": "success",
        "username": db_username,
        "email": db_email,
        "credits": db_credits,
        "active_plan": db_active_plan
    }

@app.post("/api/auth/update")
async def auth_update(req: UpdateUserRequest):
    db.execute(
        "UPDATE users SET credits = ?, active_plan = ? WHERE username = ?",
        (req.credits, req.active_plan, req.username)
    )
    return {"status": "success"}

@app.get("/api/auth/user")
async def auth_user(username: str):
    user = db.fetchone(
        "SELECT username, email, credits, active_plan FROM users WHERE username = ?",
        (username,)
    )
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
        
    db_username, db_email, db_credits, db_active_plan = user
    return {
        "username": db_username,
        "email": db_email,
        "credits": db_credits,
        "active_plan": db_active_plan
    }

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
    querystring = {"query": query, "page": str(page), "num_pages": "3"}
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

class EmailConnectRequest(BaseModel):
    username: str
    email_address: str
    app_password: str
    imap_server: str = "imap.gmail.com"

@app.post("/api/email/connect")
async def email_connect(req: EmailConnectRequest):
    import imaplib
    try:
        # Test IMAP connection
        mail = imaplib.IMAP4_SSL(req.imap_server)
        mail.login(req.email_address, req.app_password)
        mail.logout()
        
        # Connection successful, save credentials
        db.execute(
            "INSERT INTO email_credentials (username, email_address, app_password, imap_server) VALUES (?, ?, ?, ?) "
            "ON CONFLICT(username) DO UPDATE SET email_address=excluded.email_address, app_password=excluded.app_password, imap_server=excluded.imap_server",
            (req.username, req.email_address, req.app_password, req.imap_server)
        )
        return {"status": "success", "message": "Email connected successfully."}
    except imaplib.IMAP4.error as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed. Please check your App Password. Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"IMAP connection failed. Error: {str(e)}")

class EmailSyncRequest(BaseModel):
    username: str
    tracked_companies: list[str]  # e.g. ["Google", "Microsoft", "Stripe"]

from fastapi.responses import RedirectResponse
import urllib.parse
import time
from fastapi import Request

@app.get("/api/auth/google/login")
async def google_login(request: Request):
    client_id = os.environ.get("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(status_code=500, detail="Google OAuth not configured on server")
        
    redirect_uri = "http://localhost:8000/api/auth/google/callback"
    if os.environ.get("VERCEL"):
        # For production
        redirect_uri = "https://" + request.headers.get("host", "") + "/api/auth/google/callback"
        
    scope = "openid email profile https://www.googleapis.com/auth/gmail.readonly"
    
    url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": client_id.strip(),
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": scope,
        "access_type": "offline",
        "prompt": "consent"
    }
    query_string = urllib.parse.urlencode(params)
    return RedirectResponse(f"{url}?{query_string}")

@app.get("/api/auth/google/callback")
async def google_callback(request: Request, code: str = None, error: str = None):
    if error:
        return RedirectResponse(f"http://localhost:3000/login?error={urllib.parse.quote(error)}")
        
    client_id = os.environ.get("GOOGLE_CLIENT_ID", "").strip()
    client_secret = os.environ.get("GOOGLE_CLIENT_SECRET", "").strip()
    
    redirect_uri = "http://localhost:8000/api/auth/google/callback"
    if os.environ.get("VERCEL"):
        redirect_uri = "https://" + request.headers.get("host", "") + "/api/auth/google/callback"
        
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri
    }
    
    async with httpx.AsyncClient() as client:
        token_res = await client.post(token_url, data=data)
        if token_res.status_code != 200:
            return RedirectResponse(f"http://localhost:3000/login?error={urllib.parse.quote('Failed to obtain token from Google')}")
            
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token")
        expires_in = token_data.get("expires_in", 3600)
        expires_at = int(time.time()) + expires_in
        
        # Get user profile
        user_info_res = await client.get("https://www.googleapis.com/oauth2/v2/userinfo", headers={"Authorization": f"Bearer {access_token}"})
        if user_info_res.status_code != 200:
            return RedirectResponse(f"http://localhost:3000/login?error={urllib.parse.quote('Failed to fetch user info from Google')}")
            
        user_info = user_info_res.json()
        email = user_info.get("email", "").lower()
        # Generate a username if none exists, just using email prefix
        username = email.split('@')[0] if email else "google_user"
        
        # Check if user exists
        existing_user = db.fetchone("SELECT username FROM users WHERE email = ?", (email,))
        if existing_user:
            username = existing_user[0]
        else:
            # Create user
            # Avoid username collisions
            test_username = username
            counter = 1
            while db.fetchone("SELECT 1 FROM users WHERE username = ?", (test_username,)):
                test_username = f"{username}{counter}"
                counter += 1
            username = test_username
            db.execute(
                "INSERT INTO users (username, email, password, credits, active_plan) VALUES (?, ?, ?, ?, ?)",
                (username, email, "", 400, "free")
            )
            
        # Store OAuth tokens
        db.execute(
            "INSERT INTO oauth_tokens (username, access_token, refresh_token, expires_at) VALUES (?, ?, ?, ?) "
            "ON CONFLICT(username) DO UPDATE SET access_token=excluded.access_token, "
            "refresh_token=COALESCE(excluded.refresh_token, oauth_tokens.refresh_token), expires_at=excluded.expires_at",
            (username, access_token, refresh_token, expires_at)
        )
        
        # Redirect to frontend with query params to set local storage
        frontend_url = "http://localhost:3000" if not os.environ.get("VERCEL") else "https://" + request.headers.get("host", "").replace("api.", "")
        return RedirectResponse(f"{frontend_url}/login?googleAuth=true&username={urllib.parse.quote(username)}&email={urllib.parse.quote(email)}")


@app.post("/api/email/sync")
async def email_sync(req: EmailSyncRequest):
    import datetime
    
    # 1. First, check if they connected via Google OAuth
    oauth = db.fetchone("SELECT access_token, refresh_token, expires_at FROM oauth_tokens WHERE username = ?", (req.username,))
    
    if oauth:
        access_token, refresh_token, expires_at = oauth
        
        # Refresh token if expired
        if int(time.time()) > expires_at - 300 and refresh_token:
            client_id = os.environ.get("GOOGLE_CLIENT_ID", "").strip()
            client_secret = os.environ.get("GOOGLE_CLIENT_SECRET", "").strip()
            async with httpx.AsyncClient() as client:
                refresh_res = await client.post("https://oauth2.googleapis.com/token", data={
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "refresh_token": refresh_token,
                    "grant_type": "refresh_token"
                })
                if refresh_res.status_code == 200:
                    r_data = refresh_res.json()
                    access_token = r_data.get("access_token")
                    expires_at = int(time.time()) + r_data.get("expires_in", 3600)
                    db.execute("UPDATE oauth_tokens SET access_token = ?, expires_at = ? WHERE username = ?", (access_token, expires_at, req.username))
        
        updates = []
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {access_token}"}
            # Search Gmail for last 14 days
            date_limit = (datetime.date.today() - datetime.timedelta(days=14)).strftime("%Y/%m/%d")
            query = f"after:{date_limit}"
            
            res = await client.get("https://gmail.googleapis.com/gmail/v1/users/me/messages", params={"q": query, "maxResults": 20}, headers=headers)
            if res.status_code == 200:
                messages = res.json().get("messages", [])
                for m in messages:
                    msg_res = await client.get(f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{m['id']}", params={"format": "metadata", "metadataHeaders": ["Subject", "From"]}, headers=headers)
                    if msg_res.status_code == 200:
                        msg_data = msg_res.json()
                        snippet = msg_data.get("snippet", "").lower()
                        headers = msg_data.get("payload", {}).get("headers", [])
                        subject = next((h["value"] for h in headers if h["name"] == "Subject"), "").lower()
                        from_header = next((h["value"] for h in headers if h["name"] == "From"), "").lower()
                        
                        text_to_search = f"{subject} {snippet} {from_header}"
                        
                        for company in req.tracked_companies:
                            if company.lower() in text_to_search:
                                new_status = None
                                if any(word in text_to_search for word in ["offer", "congratulations", "welcome to"]):
                                    new_status = "Offered"
                                elif any(word in text_to_search for word in ["interview", "schedule", "next steps", "availability", "chat"]):
                                    new_status = "Interviewing"
                                elif any(word in text_to_search for word in ["unfortunately", "not moving forward", "other candidates", "regret", "decided to proceed"]):
                                    new_status = "Rejected"
                                    
                                if new_status:
                                    existing = next((u for u in updates if u["company"] == company), None)
                                    if not existing:
                                        updates.append({"company": company, "new_status": new_status})
                                    else:
                                        existing["new_status"] = new_status
                return {"status": "success", "updates": updates, "method": "gmail_api"}
            else:
                # If Gmail API fails, it might mean the token is fully invalid, we should throw error
                raise HTTPException(status_code=401, detail="Google authentication expired. Please reconnect your account.")
    
    # 2. Fallback to IMAP if they connected via App Passwords previously
    creds = db.fetchone("SELECT email_address, app_password, imap_server FROM email_credentials WHERE username = ?", (req.username,))
    if creds:
        import imaplib
        import email
        from email.header import decode_header
        
        email_address, app_password, imap_server = creds
        updates = []
        try:
            mail = imaplib.IMAP4_SSL(imap_server)
            mail.login(email_address, app_password)
            mail.select("inbox")
            
            # Search for emails in the last 14 days
            date_limit = (datetime.date.today() - datetime.timedelta(days=14)).strftime("%d-%b-%Y")
            status, messages = mail.search(None, f'(SINCE "{date_limit}")')
            
            if status == "OK" and messages[0]:
                email_ids = messages[0].split()
                # To avoid parsing too many emails, limit to last 20
                email_ids = email_ids[-20:]
                
                for eid in email_ids:
                    res, msg_data = mail.fetch(eid, "(RFC822)")
                    for response_part in msg_data:
                        if isinstance(response_part, tuple):
                            msg = email.message_from_bytes(response_part[1])
                            
                            subject, encoding = decode_header(msg["Subject"])[0]
                            if isinstance(subject, bytes):
                                subject = subject.decode(encoding if encoding else "utf-8", errors="ignore")
                                
                            from_header = msg.get("From", "")
                            
                            # Get body text
                            body = ""
                            if msg.is_multipart():
                                for part in msg.walk():
                                    if part.get_content_type() == "text/plain":
                                        body_bytes = part.get_payload(decode=True)
                                        if body_bytes:
                                            body = body_bytes.decode(errors="ignore")
                                            break
                            else:
                                body_bytes = msg.get_payload(decode=True)
                                if body_bytes:
                                    body = body_bytes.decode(errors="ignore")
                                    
                            text_to_search = (subject + " " + body).lower()
                            
                            # Check against tracked companies
                            for company in req.tracked_companies:
                                if company.lower() in text_to_search or company.lower() in from_header.lower():
                                    # Simple NLP parsing logic for status
                                    new_status = None
                                    if any(word in text_to_search for word in ["offer", "congratulations", "welcome to"]):
                                        new_status = "Offered"
                                    elif any(word in text_to_search for word in ["interview", "schedule", "next steps", "availability", "chat"]):
                                        new_status = "Interviewing"
                                    elif any(word in text_to_search for word in ["unfortunately", "not moving forward", "other candidates", "regret", "decided to proceed"]):
                                        new_status = "Rejected"
                                        
                                    if new_status:
                                        # We keep the highest update found for a company
                                        existing = next((u for u in updates if u["company"] == company), None)
                                        if not existing:
                                            updates.append({"company": company, "new_status": new_status})
                                        else:
                                            # Only upgrade status in priority sequence if needed, but for simplicity, we just keep the latest we parse.
                                            existing["new_status"] = new_status
                                    
            mail.close()
            mail.logout()
            return {"status": "success", "updates": updates, "method": "imap"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error syncing via IMAP: {str(e)}")

    # If neither method exists
    raise HTTPException(status_code=404, detail="Email not connected. Please Sign in with Google or connect via App Password.")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
