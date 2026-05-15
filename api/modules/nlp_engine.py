"""
NLP Engine Module
Uses spaCy to extract skills, education, experience, and entities.
"""
import re
import spacy
import spacy.cli
from typing import Optional

# ---------------------------------------------------------------------------
# Skill taxonomy – a curated set of technical & soft skills for matching
# ---------------------------------------------------------------------------
TECHNICAL_SKILLS = {
    # Programming languages
    "python", "java", "javascript", "typescript", "c++", "c#", "c",
    "go", "golang", "rust", "kotlin", "swift", "ruby", "php", "r",
    "scala", "perl", "matlab", "julia", "dart", "elixir",
    # Web
    "html", "css", "react", "reactjs", "react.js", "angular", "vue",
    "vuejs", "next.js", "nextjs", "nuxt", "svelte", "node.js", "nodejs",
    "express", "expressjs", "django", "flask", "fastapi", "spring",
    "spring boot", "laravel", "rails", "ruby on rails", "asp.net",
    "graphql", "rest", "restful", "soap", "websocket",
    # Data / ML / AI
    "machine learning", "deep learning", "nlp", "natural language processing",
    "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn",
    "sklearn", "pandas", "numpy", "matplotlib", "seaborn", "plotly",
    "hugging face", "transformers", "llm", "gpt", "bert", "xgboost",
    "lightgbm", "random forest", "neural network", "cnn", "rnn", "lstm",
    "data science", "data analysis", "data engineering", "etl",
    "feature engineering", "model deployment", "mlops",
    # Cloud & DevOps
    "aws", "amazon web services", "azure", "gcp", "google cloud",
    "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins",
    "ci/cd", "github actions", "gitlab ci", "circleci", "linux",
    "bash", "shell scripting", "nginx", "apache", "helm",
    # Databases
    "sql", "mysql", "postgresql", "postgres", "sqlite", "mongodb",
    "redis", "elasticsearch", "cassandra", "dynamodb", "firebase",
    "oracle", "mssql", "neo4j", "influxdb",
    # Tools & practices
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "agile", "scrum", "kanban", "tdd", "bdd", "microservices",
    "api", "swagger", "postman", "figma", "tableau", "power bi",
    "excel", "spark", "hadoop", "airflow", "kafka", "rabbitmq",
    # Security
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

# Degree keywords
DEGREE_KEYWORDS = {
    "bachelor", "b.s.", "bs", "b.e.", "be", "b.tech", "btech",
    "master", "m.s.", "ms", "m.e.", "me", "m.tech", "mtech",
    "phd", "ph.d.", "doctorate", "associate", "diploma", "mba",
    "b.sc", "bsc", "m.sc", "msc", "b.a.", "ba", "m.a.", "ma",
}

# Action verbs for bullet analysis
WEAK_VERBS = {
    "worked", "helped", "assisted", "did", "made", "got", "had",
    "used", "tried", "went", "handled", "dealt", "involved",
    "responsible", "participated", "contributed",
}

STRONG_VERBS = [
    "Developed", "Designed", "Implemented", "Architected", "Built",
    "Engineered", "Optimized", "Automated", "Deployed", "Migrated",
    "Led", "Managed", "Coordinated", "Mentored", "Trained",
    "Increased", "Reduced", "Improved", "Accelerated", "Generated",
    "Analyzed", "Researched", "Investigated", "Evaluated", "Assessed",
    "Launched", "Created", "Established", "Initiated", "Spearheaded",
    "Collaborated", "Partnered", "Facilitated", "Streamlined", "Transformed",
]


class NLPEngine:
    """Extracts structured information from resume text using spaCy."""

    def __init__(self):
        self._nlp: Optional[spacy.language.Language] = None

    def _get_nlp(self):
        if self._nlp is None:
            # Stage 1: Try standard load
            try:
                self._nlp = spacy.load("en_core_web_sm")
            except Exception:
                # Stage 2: Try loading by importing (works for .whl installs)
                try:
                    import en_core_web_sm
                    self._nlp = en_core_web_sm.load()
                except Exception:
                    # Stage 3: Auto-download (Last resort for cloud environments)
                    try:
                        print("Downloading spaCy model on the fly...")
                        spacy.cli.download("en_core_web_sm")
                        self._nlp = spacy.load("en_core_web_sm")
                    except Exception as e:
                        # Final Fallback: Basic English logic
                        print(f"Model download failed: {e}. Using blank model.")
                        self._nlp = spacy.blank("en")
        return self._nlp

    # ------------------------------------------------------------------ #
    #  Public API                                                          #
    # ------------------------------------------------------------------ #

    def analyze(self, text: str, sections: dict) -> dict:
        """
        Full NLP analysis of resume text.
        Returns:
            {
                "skills": list[str],
                "technical_skills": list[str],
                "soft_skills": list[str],
                "education": list[dict],
                "experience_years": int,
                "entities": dict,
                "action_verb_score": float,
                "quantification_score": float,
                "bullet_points": list[str],
                "weak_bullets": list[str],
            }
        """
        nlp = self._get_nlp()
        doc = nlp(text[:100_000])  # cap to avoid memory issues

        skills = self._extract_skills(text)
        tech = [s for s in skills if s.lower() in TECHNICAL_SKILLS]
        soft = [s for s in skills if s.lower() in SOFT_SKILLS]

        education = self._extract_education(
            sections.get("education", text)
        )
        exp_years = self._estimate_experience_years(
            sections.get("experience", text)
        )
        entities = self._extract_entities(doc)
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

    def extract_skills_from_text(self, text: str) -> list[str]:
        return self._extract_skills(text)

    # ------------------------------------------------------------------ #
    #  Private helpers                                                     #
    # ------------------------------------------------------------------ #

    def _extract_skills(self, text: str) -> list[str]:
        """Multi-word and single-word skill matching."""
        lower = text.lower()
        found = set()

        # Sort by length desc so multi-word phrases match first
        for skill in sorted(ALL_SKILLS, key=len, reverse=True):
            pattern = r"\b" + re.escape(skill) + r"\b"
            if re.search(pattern, lower):
                found.add(skill.title() if len(skill.split()) == 1 else skill)
        return sorted(found)

    def _extract_education(self, text: str) -> list[dict]:
        """Parse degree, field, institution from education section."""
        results = []
        lines = text.splitlines()
        for line in lines:
            lower = line.lower()
            for deg in DEGREE_KEYWORDS:
                if deg in lower:
                    results.append({
                        "line": line.strip(),
                        "degree": deg.upper(),
                    })
                    break
        return results

    def _estimate_experience_years(self, text: str) -> int:
        """Estimate total years of experience from date ranges."""
        # Match patterns like 2019-2022, Jan 2020 - Dec 2023, etc.
        pattern = r"\b(20\d{2}|19\d{2})\b"
        years = list(map(int, re.findall(pattern, text)))
        if len(years) >= 2:
            return max(years) - min(years)
        return 0

    def _extract_entities(self, doc) -> dict:
        """Extract named entities grouped by type."""
        entities: dict[str, list[str]] = {}
        for ent in doc.ents:
            entities.setdefault(ent.label_, [])
            if ent.text.strip() not in entities[ent.label_]:
                entities[ent.label_].append(ent.text.strip())
        return entities

    def _extract_bullets(self, text: str) -> list[str]:
        """Extract bullet-point style lines."""
        bullets = []
        for line in text.splitlines():
            stripped = line.strip()
            if stripped.startswith(("•", "-", "*", "–", "▪")):
                cleaned = re.sub(r"^[•\-\*–▪]\s*", "", stripped).strip()
                if len(cleaned.split()) >= 4:
                    bullets.append(cleaned)
        return bullets

    def _find_weak_bullets(self, bullets: list[str]) -> list[str]:
        """Identify bullets starting with weak verbs."""
        weak = []
        for b in bullets:
            first_word = b.split()[0].lower().rstrip(",") if b.split() else ""
            if first_word in WEAK_VERBS:
                weak.append(b)
        return weak

    def _action_verb_score(self, bullets: list[str]) -> float:
        """0-1 score: fraction of bullets that start with a strong verb."""
        if not bullets:
            return 0.0
        strong_set = {v.lower() for v in STRONG_VERBS}
        count = sum(
            1 for b in bullets
            if b.split() and b.split()[0].lower() in strong_set
        )
        return round(count / len(bullets), 2)

    def _quantification_score(self, bullets: list[str]) -> float:
        """0-1 score: fraction of bullets that contain numbers/metrics."""
        if not bullets:
            return 0.0
        pattern = re.compile(r"\d+[\d,\.]*\s*(%|x|times|hrs?|hours?|users?|customers?|million|k\b)", re.I)
        count = sum(1 for b in bullets if pattern.search(b) or re.search(r"\d+", b))
        return round(count / len(bullets), 2)
