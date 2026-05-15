"""
Job Matcher Module
TF-IDF + cosine similarity for resume ↔ job description matching.
"""
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from modules.nlp_engine import ALL_SKILLS, TECHNICAL_SKILLS


class JobMatcher:
    """Computes similarity between resume and job description."""

    def __init__(self):
        self._vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            stop_words="english",
            min_df=1,
            sublinear_tf=True,
        )

    def match(
        self,
        resume_text: str,
        job_text: str,
        resume_skills: list[str],
    ) -> dict:
        """
        Full matching analysis.
        Returns:
            {
                "match_score": float,          # 0-100
                "matching_keywords": list[str],
                "missing_keywords": list[str],
                "job_skills": list[str],
                "resume_skills": list[str],
                "keyword_density": float,
            }
        """
        match_score = self._cosine_score(resume_text, job_text)
        job_skills = self._extract_job_skills(job_text)

        resume_skills_lower = {s.lower() for s in resume_skills}
        job_skills_lower = {s.lower() for s in job_skills}

        matching = sorted(
            job_skills_lower & resume_skills_lower
        )
        missing = sorted(
            job_skills_lower - resume_skills_lower
        )

        # Keyword density: ratio of JD terms present in resume
        jd_tokens = set(self._tokenize(job_text))
        resume_tokens = set(self._tokenize(resume_text))
        common_tokens = jd_tokens & resume_tokens
        density = round(len(common_tokens) / max(len(jd_tokens), 1), 2)

        return {
            "match_score": round(match_score * 100, 1),
            "matching_keywords": [k.title() for k in matching],
            "missing_keywords": [k.title() for k in missing],
            "job_skills": [s.title() for s in sorted(job_skills_lower)],
            "resume_skills": [s.title() for s in sorted(resume_skills_lower)],
            "keyword_density": density,
        }

    # ------------------------------------------------------------------ #
    #  Private helpers                                                     #
    # ------------------------------------------------------------------ #

    def _cosine_score(self, resume: str, job: str) -> float:
        """Compute TF-IDF cosine similarity between two texts."""
        try:
            tfidf = self._vectorizer.fit_transform([resume, job])
            score = float(cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0])
        except Exception:
            score = 0.0
        return min(score, 1.0)

    def _extract_job_skills(self, job_text: str) -> set[str]:
        """Find skills mentioned in the job description."""
        lower = job_text.lower()
        found = set()
        for skill in sorted(ALL_SKILLS, key=len, reverse=True):
            pattern = r"\b" + re.escape(skill) + r"\b"
            if re.search(pattern, lower):
                found.add(skill)
        return found

    def _tokenize(self, text: str) -> list[str]:
        """Simple word tokeniser (no stop words here)."""
        return re.findall(r"\b[a-z]{3,}\b", text.lower())
