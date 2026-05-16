"""
Smart Suggestions Engine
Generates actionable, intelligent improvements for resumes.
Rule-based with pattern matching — no external API required.
"""
import re
import random
from modules.nlp_engine import STRONG_VERBS, WEAK_VERBS


# ---------------------------------------------------------------------------
# Improvement templates for weak bullet points
# ---------------------------------------------------------------------------
IMPROVEMENT_TEMPLATES = {
    "worked on": [
        "Developed and maintained {object}, resulting in improved {outcome}.",
        "Engineered {object} that enhanced {outcome} by {metric}.",
    ],
    "helped": [
        "Collaborated with cross-functional teams to deliver {object}, achieving {outcome}.",
        "Contributed to {object}, directly improving {outcome}.",
    ],
    "assisted": [
        "Supported and co-led development of {object}, improving {outcome}.",
        "Partnered with senior engineers to architect {object} and boost {outcome}.",
    ],
    "did": [
        "Implemented {object} that reduced {outcome} by {metric}.",
        "Executed {object} delivering measurable improvements in {outcome}.",
    ],
    "made": [
        "Built and deployed {object}, increasing {outcome} by {metric}.",
        "Designed and developed {object} for {outcome}.",
    ],
    "responsible for": [
        "Led the development of {object}, achieving {outcome} within deadline.",
        "Owned end-to-end implementation of {object}, resulting in {outcome}.",
    ],
    "involved in": [
        "Actively contributed to {object}, driving {outcome}.",
        "Participated in and co-developed {object} that improved {outcome}.",
    ],
}

OUTCOMES = [
    "user engagement", "system performance", "code quality",
    "deployment frequency", "team productivity", "customer satisfaction",
    "error rates", "response time", "scalability",
]

METRICS = [
    "20%", "30%", "40%", "25%", "2x", "50%", "3x",
]


# Skill roadmaps per domain
SKILL_ROADMAPS = {
    "data science": [
        "Pandas & NumPy (data manipulation)",
        "Scikit-learn (ML models)",
        "Deep Learning with PyTorch or TensorFlow",
        "SQL for data querying",
        "Data visualization with Matplotlib/Seaborn",
        "MLOps & model deployment (Docker, FastAPI)",
    ],
    "web development": [
        "HTML/CSS/JavaScript fundamentals",
        "React or Vue.js (frontend framework)",
        "Node.js + Express (backend)",
        "REST API design",
        "SQL + NoSQL databases",
        "Docker & CI/CD pipelines",
    ],
    "cloud & devops": [
        "Linux command line",
        "Git & version control",
        "Docker & Kubernetes",
        "AWS/Azure/GCP fundamentals",
        "Infrastructure as Code (Terraform)",
        "CI/CD with GitHub Actions or Jenkins",
    ],
    "machine learning": [
        "Python & NumPy fundamentals",
        "Statistics & probability",
        "Scikit-learn for classical ML",
        "Neural networks with TensorFlow/PyTorch",
        "NLP with Hugging Face Transformers",
        "Computer vision (OpenCV, CNNs)",
    ],
    "mobile development": [
        "Swift (iOS) or Kotlin (Android)",
        "React Native for cross-platform",
        "REST API integration",
        "Firebase for backend services",
        "App Store / Play Store deployment",
    ],
}


class SuggestionsEngine:
    """Generates rule-based smart improvement suggestions."""

    def generate(
        self,
        parsed: dict,
        nlp_data: dict,
        match_data: dict,
        ats_data: dict,
        job_text: str,
    ) -> dict:
        """
        Produce all suggestions.
        Returns:
            {
                "bullet_improvements": list[dict],
                "missing_skills_advice": list[str],
                "section_suggestions": list[str],
                "formatting_tips": list[str],
                "quantification_tips": list[str],
                "action_verb_tips": list[str],
                "skill_roadmap": list[str],
                "priority_actions": list[str],
            }
        """
        bullet_improvements = self._improve_bullets(
            nlp_data.get("weak_bullets", [])
        )
        missing_advice = self._missing_skills_advice(
            match_data.get("missing_keywords", [])
        )
        section_sugg = self._section_suggestions(
            ats_data.get("section_feedback", {})
        )
        fmt_tips = ats_data.get("formatting_issues", [])
        quant_tips = self._quantification_tips(
            nlp_data.get("bullet_points", []),
            nlp_data.get("quantification_score", 0),
        )
        av_tips = self._action_verb_tips(
            nlp_data.get("action_verb_score", 0)
        )
        roadmap = self._build_roadmap(job_text)
        priorities = self._priority_actions(
            ats_data, match_data, nlp_data
        )

        return {
            "bullet_improvements": bullet_improvements,
            "missing_skills_advice": missing_advice,
            "section_suggestions": section_sugg,
            "formatting_tips": fmt_tips,
            "quantification_tips": quant_tips,
            "action_verb_tips": av_tips,
            "skill_roadmap": roadmap,
            "priority_actions": priorities,
        }

    # ------------------------------------------------------------------ #
    #  Sub-generators                                                      #
    # ------------------------------------------------------------------ #

    def _improve_bullets(self, weak_bullets: list[str]) -> list[dict]:
        """Transform weak bullets into strong ones."""
        results = []
        for bullet in weak_bullets[:6]:  # limit to 6
            improved = self._rewrite_bullet(bullet)
            results.append({
                "original": bullet,
                "improved": improved,
                "tip": "Use a strong action verb and add a quantifiable outcome.",
            })
        return results

    def _rewrite_bullet(self, bullet: str) -> str:
        """Rule-based bullet rewrite using templates."""
        lower = bullet.lower()

        # Find matching template
        for trigger, templates in IMPROVEMENT_TEMPLATES.items():
            if trigger in lower:
                # Extract the object (words after the trigger phrase)
                idx = lower.find(trigger) + len(trigger)
                rest = bullet[idx:].strip()
                obj = rest[:50] if rest else "the system"
                template = random.choice(templates)
                outcome = random.choice(OUTCOMES)
                metric = random.choice(METRICS)
                return template.format(
                    object=obj if obj else "the feature",
                    outcome=outcome,
                    metric=metric,
                )

        # Generic fallback: prepend strong verb
        verb = random.choice(list(STRONG_VERBS)[:10])
        words = bullet.split()
        if words:
            # Remove weak first word
            first = words[0].lower().rstrip(",")
            if first in WEAK_VERBS:
                rest = " ".join(words[1:])
            else:
                rest = bullet
            outcome = random.choice(OUTCOMES)
            metric = random.choice(METRICS)
            return f"{verb} {rest}, improving {outcome} by {metric}."
        return bullet

    def _missing_skills_advice(self, missing: list[str]) -> list[str]:
        """Generate advice for each missing skill."""
        advice = []
        for skill in missing[:8]:  # limit output
            advice.append(
                f"Add '{skill}' to your Skills section if you have experience with it, "
                f"or include it in a project/course context."
            )
        return advice

    def _section_suggestions(self, section_fb: dict) -> list[str]:
        """Turn section feedback into actionable suggestions."""
        sugg = []
        for section, fb in section_fb.items():
            if fb.get("status") == "missing":
                if section == "summary":
                    sugg.append(
                        "Add a Professional Summary (3–4 lines) at the top. "
                        "Example: 'Results-driven Software Engineer with 3+ years of experience building scalable web applications…'"
                    )
                elif section == "projects":
                    sugg.append(
                        "Add a Projects section. Include 2–3 impactful projects with tech stack, role, and measurable outcomes."
                    )
                elif section == "certifications":
                    sugg.append(
                        "Consider adding relevant certifications (AWS, Google, Coursera, etc.) to boost credibility."
                    )
                elif section == "skills":
                    sugg.append(
                        "Add a dedicated Skills section listing technical tools, languages, and frameworks."
                    )
            elif fb.get("status") == "weak":
                sugg.append(
                    f"Your {section.title()} section is sparse — add more details, dates, and descriptions."
                )
        return sugg

    def _quantification_tips(self, bullets: list[str], score: float) -> list[str]:
        """Provide specific quantification guidance."""
        tips = []
        if score < 0.4:
            tips.append(
                "Most of your bullets lack numbers. Add metrics wherever possible:\n"
                "  • Performance: 'reduced load time by 40%'\n"
                "  • Scale: 'served 10,000+ daily active users'\n"
                "  • Efficiency: 'cut deployment time from 2 hours to 15 minutes'"
            )
        if score < 0.6:
            for bullet in bullets[:3]:
                if not re.search(r"\d", bullet):
                    tips.append(
                        f"Consider quantifying: \"{bullet[:60]}…\" "
                        "→ Add a number, percentage, or timeframe."
                    )
        return tips

    def _action_verb_tips(self, score: float) -> list[str]:
        """Generate action verb tips based on score."""
        tips = []
        if score < 0.5:
            tips.append(
                "Replace weak verbs (worked, helped, did) with strong action verbs:\n"
                "  Engineering: Developed, Architected, Implemented, Optimized\n"
                "  Leadership: Led, Mentored, Coordinated, Managed\n"
                "  Impact: Increased, Reduced, Improved, Accelerated"
            )
        if score < 0.3:
            tips.append(
                "Start every bullet point with a past-tense action verb "
                "(e.g., 'Developed', 'Designed', 'Implemented')."
            )
        return tips

    def _build_roadmap(self, job_text: str) -> list[str]:
        """Suggest a learning roadmap based on detected domain."""
        lower = job_text.lower()
        for domain, roadmap in SKILL_ROADMAPS.items():
            keywords = domain.split()
            if any(kw in lower for kw in keywords):
                return [f"📚 {step}" for step in roadmap]
        # Fallback: general software engineering
        return [
            "📚 Master data structures & algorithms",
            "📚 Learn system design fundamentals",
            "📚 Build 2–3 portfolio projects with measurable impact",
            "📚 Get one industry certification (AWS, GCP, or similar)",
            "📚 Contribute to open-source projects",
        ]

    def _priority_actions(
        self,
        ats_data: dict,
        match_data: dict,
        nlp_data: dict,
    ) -> list[str]:
        """Rank the top 5 actions by expected score impact."""
        actions = []
        dims = ats_data.get("dimensions", {})

        if dims.get("section_completeness", 100) < 60:
            actions.append("🔴 HIGH: Add missing sections (Experience, Education, Skills) — biggest ATS impact")

        if match_data.get("match_score", 100) < 50:
            missing = match_data.get("missing_keywords", [])[:3]
            kws = ", ".join(missing) if missing else "key job-description terms"
            actions.append(f"🔴 HIGH: Incorporate missing keywords ({kws}) from the job description")

        if dims.get("formatting", 100) < 70:
            actions.append("🟡 MEDIUM: Fix formatting issues (remove tables/images, simplify structure)")

        if dims.get("action_verbs", 100) < 60:
            actions.append("🟡 MEDIUM: Replace weak verbs (worked, helped) with strong action verbs")

        if dims.get("quantification", 100) < 50:
            actions.append("🟡 MEDIUM: Add metrics and numbers to at least 50% of your bullet points")

        if not actions:
            actions.append("✅ Your resume is well-structured — focus on tailoring keywords for each application")

        return actions[:5]
