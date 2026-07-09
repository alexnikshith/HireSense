"""
ATS Scoring Engine
Scores a resume 0–100 based on multiple weighted dimensions.
"""
import re


# ---------------------------------------------------------------------------
# Weights for each scoring dimension (must sum to 100)
# ---------------------------------------------------------------------------
WEIGHTS = {
    "keyword_relevance": 30,   # How well keywords match JD
    "section_completeness": 25, # Presence of important sections
    "formatting": 15,          # ATS-friendly formatting
    "action_verbs": 10,        # Strong action verbs in bullets
    "quantification": 10,      # Numbers/metrics in achievements
    "length": 10,              # Appropriate length
}

ESSENTIAL_SECTIONS = ["experience", "education", "skills"]
IMPORTANT_SECTIONS = ["summary", "projects", "certifications"]


class ATSScorer:
    """Computes an ATS compatibility score with dimensional breakdown."""

    def score(
        self,
        parsed: dict,
        nlp_data: dict,
        match_data: dict,
    ) -> dict:
        """
        Compute overall ATS score and per-dimension breakdown.
        Args:
            parsed:     Output from ResumeParser.parse()
            nlp_data:   Output from NLPEngine.analyze()
            match_data: Output from JobMatcher.match()
        Returns:
            {
                "overall_score": int,    # 0-100
                "grade": str,            # A/B/C/D/F
                "dimensions": dict,      # score per dimension
                "section_feedback": dict,
                "formatting_issues": list[str],
            }
        """
        dimensions = {}

        # 1. Keyword relevance (derived from match score)
        dimensions["keyword_relevance"] = self._score_keyword_relevance(
            match_data
        )

        # 2. Section completeness
        dimensions["section_completeness"], section_fb = (
            self._score_sections(parsed["sections"])
        )

        # 3. Formatting
        dimensions["formatting"], fmt_issues = self._score_formatting(
            parsed
        )

        # 4. Action verbs
        dimensions["action_verbs"] = self._score_action_verbs(nlp_data)

        # 5. Quantification
        dimensions["quantification"] = self._score_quantification(nlp_data)

        # 6. Length appropriateness
        dimensions["length"] = self._score_length(parsed)

        # Weighted total
        total = sum(
            (dimensions[k] / 100) * WEIGHTS[k] for k in WEIGHTS
        )
        overall = round(total)

        return {
            "overall_score": overall,
            "grade": self._grade(overall),
            "dimensions": {
                k: round(dimensions[k]) for k in WEIGHTS
            },
            "section_feedback": section_fb,
            "formatting_issues": fmt_issues,
        }

    # ------------------------------------------------------------------ #
    #  Dimension scorers (each returns 0-100)                              #
    # ------------------------------------------------------------------ #

    def _score_keyword_relevance(self, match_data: dict) -> float:
        """Combine match score and keyword density."""
        ms = match_data.get("match_score", 0)        # 0-100
        density = match_data.get("keyword_density", 0)  # 0-1
        return min(ms * 0.7 + density * 100 * 0.3, 100)

    def _score_sections(self, sections: dict) -> tuple[float, dict]:
        """Score completeness and return per-section feedback."""
        feedback = {}
        score = 0.0

        for s in ESSENTIAL_SECTIONS:
            if s in sections and len(sections[s].strip()) > 20:
                score += 25
                feedback[s] = {"status": "good", "message": f"{s.title()} section found and populated."}
            elif s in sections:
                score += 10
                feedback[s] = {"status": "weak", "message": f"{s.title()} section exists but is very sparse."}
            else:
                feedback[s] = {"status": "missing", "message": f"⚠️ {s.title()} section is missing — critical for ATS!"}

        for s in IMPORTANT_SECTIONS:
            if s in sections and len(sections[s].strip()) > 20:
                score += 8.33
                feedback[s] = {"status": "good", "message": f"{s.title()} section found."}
            else:
                feedback[s] = {"status": "missing", "message": f"{s.title()} section not detected — recommended."}

        return min(score, 100), feedback

    def _score_formatting(self, parsed: dict) -> tuple[float, list[str]]:
        """Penalise ATS-hostile formatting."""
        score = 100.0
        issues = []

        if parsed.get("has_images"):
            score -= 20
            issues.append("Images detected — ATS systems cannot parse images. Remove all graphics/photos.")

        if parsed.get("has_tables"):
            score -= 20
            issues.append("Tables detected — complex tables often break ATS parsers. Use plain text instead.")

        if parsed.get("page_count", 1) > 2:
            score -= 10
            issues.append(f"Resume is {parsed['page_count']} pages — most ATS prefer 1–2 pages.")

        # Check for very short content (poorly parsed)
        if parsed.get("word_count", 0) < 100:
            score -= 30
            issues.append("Very little text extracted — resume may have parsing issues (scanned PDF?).")

        # Check for excessive special characters
        raw = parsed.get("raw_text", "")
        special_ratio = len(re.findall(r"[^\x20-\x7E]", raw)) / max(len(raw), 1)
        if special_ratio > 0.05:
            score -= 10
            issues.append("High proportion of special characters — may indicate complex formatting.")

        return max(score, 0), issues

    def _score_action_verbs(self, nlp_data: dict) -> float:
        """Map action verb score to 0-100."""
        av = nlp_data.get("action_verb_score", 0)  # 0-1
        bullets = nlp_data.get("bullet_points", [])
        if not bullets:
            return 40  # no bullets → moderate penalty
        return min(av * 100, 100)

    def _score_quantification(self, nlp_data: dict) -> float:
        qs = nlp_data.get("quantification_score", 0)  # 0-1
        bullets = nlp_data.get("bullet_points", [])
        if not bullets:
            return 30
        return min(qs * 100, 100)

    def _score_length(self, parsed: dict) -> float:
        """Optimal word count 300–700; penalise outliers."""
        wc = parsed.get("word_count", 0)
        if 300 <= wc <= 700:
            return 100.0
        elif wc < 150:
            return 30.0
        elif wc < 300:
            return 60.0
        elif wc <= 900:
            return 85.0
        else:
            return 65.0  # too verbose

    # ------------------------------------------------------------------ #

    def _grade(self, score: int) -> str:
        if score >= 85:
            return "A"
        elif score >= 70:
            return "B"
        elif score >= 55:
            return "C"
        elif score >= 40:
            return "D"
        return "F"
