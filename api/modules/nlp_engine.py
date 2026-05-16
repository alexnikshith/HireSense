"""
Lite NLP Engine Module
Uses optimized Keyword Matching and Regex to extract skills, education, and entities.
This version is designed for high-performance cloud deployment (Vercel).
"""
import re
from typing import Optional

# ---------------------------------------------------------------------------
# Skill taxonomy – a curated set of technical & soft skills for matching
# ---------------------------------------------------------------------------
TECHNICAL_SKILLS = {
    "python", "java", "javascript", "typescript", "c++", "c#", "c",
    "go", "golang", "rust", "kotlin", "swift", "ruby", "php", "r",
    "scala", "perl", "matlab", "julia", "dart", "elixir",
    "html", "css", "react", "reactjs", "react.js", "angular", "vue",
    "vuejs", "next.js", "nextjs", "nuxt", "svelte", "node.js", "nodejs",
    "express", "expressjs", "django", "flask", "fastapi", "spring",
    "spring boot", "laravel", "rails", "ruby on rails", "asp.net",
    "graphql", "rest", "restful", "soap", "websocket",
    "machine learning", "deep learning", "nlp", "natural language processing",
    "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn",
    "sklearn", "pandas", "numpy", "matplotlib", "seaborn", "plotly",
    "hugging face", "transformers", "llm", "gpt", "bert", "xgboost",
    "lightgbm", "random forest", "neural network", "cnn", "rnn", "lstm",
    "data science", "data analysis", "data engineering", "etl",
    "feature engineering", "model deployment", "mlops",
    "aws", "amazon web services", "azure", "gcp", "google cloud",
    "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins",
    "ci/cd", "github actions", "gitlab ci", "circleci", "linux",
    "bash", "shell scripting", "nginx", "apache", "helm",
    "sql", "mysql", "postgresql", "postgres", "sqlite", "mongodb",
    "redis", "elasticsearch", "cassandra", "dynamodb", "firebase",
    "oracle", "mssql", "neo4j", "influxdb",
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "agile", "scrum", "kanban", "tdd", "bdd", "microservices",
    "api", "swagger", "postman", "figma", "tableau", "power bi",
    "excel", "spark", "hadoop", "airflow", "kafka", "rabbitmq",
    "cybersecurity", "penetration testing", "owasp", "ssl", "tls",
    "oauth", "jwt", "encryption", "firewalls",
}

SOFT_SKILLS = {
    "communication", "leadership", "teamwork", "collaboration",
    "problem solving", "critical thinking", "time management",
    "adaptability", "creativity", "attention to detail",
    "project management", "mentoring", "presentation", "analytical",
    "organizational", "decision making", "conflict resolution",
}

ALL_SKILLS = TECHNICAL_SKILLS | SOFT_SKILLS

DEGREE_KEYWORDS = {
    "bachelor", "b.s.", "bs", "b.e.", "be", "b.tech", "btech",
    "master", "m.s.", "ms", "m.e.", "me", "m.tech", "mtech",
    "phd", "ph.d.", "doctorate", "associate", "diploma", "mba",
    "b.sc", "bsc", "m.sc", "msc", "b.a.", "ba", "m.a.", "ma",
}

WEAK_VERBS = [
    "worked", "helped", "assisted", "did", "made", "got", "had",
    "used", "tried", "went", "handled", "dealt", "involved",
    "responsible", "participated", "contributed",
]

STRONG_VERBS = [
    "developed", "designed", "implemented", "architected", "built",
    "engineered", "optimized", "automated", "deployed", "migrated",
    "led", "managed", "coordinated", "mentored", "trained",
    "increased", "reduced", "improved", "accelerated", "generated",
    "analyzed", "researched", "investigated", "evaluated", "assessed",
    "launched", "created", "established", "initiated", "spearheaded",
    "collaborated", "partnered", "facilitated", "streamlined", "transformed",
]

class NLPEngine:
    """Extracts structured information from resume text using Regex and Keywords."""

    def __init__(self):
        # No heavy model to load
        pass

    def analyze(self, text: str, sections: dict) -> dict:
        skills = self._extract_skills(text)
        tech = [s for s in skills if s.lower() in TECHNICAL_SKILLS]
        soft = [s for s in skills if s.lower() in SOFT_SKILLS]

        education = self._extract_education(sections.get("education", text))
        exp_years = self._estimate_experience_years(sections.get("experience", text))
        
        # Simple entity extraction using regex (Email, Phone, Dates)
        entities = {
            "GPE": [], # Locations usually hard without NLP, but can be added via list
            "DATE": re.findall(r"\b(20\d{2}|19\d{2})\b", text)
        }

        bullets = self._extract_bullets(text)
        weak = self._find_weak_bullets(bullets)
        av_score = self._action_verb_score(bullets)
        q_score = self._quantification_score(bullets)

        return {
            "skills": skills,
            "technical_skills": tech,
            "soft_skills": soft,
            "education": education,
            "experience_years": exp_years,
            "entities": entities,
            "action_verb_score": av_score,
            "quantification_score": q_score,
            "bullet_points": bullets,
            "weak_bullets": weak,
        }

    def _extract_skills(self, text: str) -> list[str]:
        lower = text.lower()
        found = set()
        for skill in sorted(ALL_SKILLS, key=len, reverse=True):
            pattern = r"\b" + re.escape(skill) + r"\b"
            if re.search(pattern, lower):
                found.add(skill.title() if len(skill.split()) == 1 else skill)
        return sorted(found)

    def _extract_education(self, text: str) -> list[dict]:
        results = []
        lines = text.splitlines()
        for line in lines:
            lower = line.lower()
            for deg in DEGREE_KEYWORDS:
                if deg in lower:
                    results.append({"line": line.strip(), "degree": deg.upper()})
                    break
        return results

    def _estimate_experience_years(self, text: str) -> int:
        years = list(map(int, re.findall(r"\b(20\d{2}|19\d{2})\b", text)))
        if len(years) >= 2:
            return max(years) - min(years)
        return 0

    def _extract_bullets(self, text: str) -> list[str]:
        bullets = []
        for line in text.splitlines():
            stripped = line.strip()
            if stripped.startswith(("•", "-", "*", "–", "▪")):
                cleaned = re.sub(r"^[•\-\*–▪]\s*", "", stripped).strip()
                if len(cleaned.split()) >= 4:
                    bullets.append(cleaned)
        return bullets

    def _find_weak_bullets(self, bullets: list[str]) -> list[str]:
        weak = []
        for b in bullets:
            words = b.split()
            if words and words[0].lower().rstrip(",") in WEAK_VERBS:
                weak.append(b)
        return weak

    def _action_verb_score(self, bullets: list[str]) -> float:
        if not bullets: return 0.0
        count = sum(1 for b in bullets if b.split() and b.split()[0].lower() in STRONG_VERBS)
        return round(count / len(bullets), 2)

    def _quantification_score(self, bullets: list[str]) -> float:
        if not bullets: return 0.0
        pattern = re.compile(r"\d+[\d,\.]*\s*(%|x|times|hrs?|hours?|users?|customers?|million|k\b)", re.I)
        count = sum(1 for b in bullets if pattern.search(b) or re.search(r"\d+", b))
        return round(count / len(bullets), 2)
