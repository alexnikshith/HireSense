"""
Resume Parser Module
Handles PDF extraction and text cleaning using PyMuPDF.
"""
import re
import fitz  # PyMuPDF
from typing import Optional


class ResumeParser:
    """Parses PDF resumes and extracts clean text with section detection."""

    SECTION_HEADERS = {
        "contact": [
            "contact", "contact information", "personal information",
            "personal details", "contact details",
        ],
        "summary": [
            "summary", "objective", "profile", "about me",
            "professional summary", "career objective",
        ],
        "experience": [
            "experience", "work experience", "employment history",
            "professional experience", "work history", "career history",
        ],
        "education": [
            "education", "academic background", "educational background",
            "academic qualifications", "qualifications",
        ],
        "skills": [
            "skills", "technical skills", "core competencies",
            "technologies", "competencies", "expertise", "key skills",
        ],
        "projects": [
            "projects", "personal projects", "academic projects",
            "key projects", "notable projects",
        ],
        "certifications": [
            "certifications", "certificates", "licenses",
            "professional development", "training",
        ],
        "achievements": [
            "achievements", "awards", "honors", "accomplishments",
            "recognition",
        ],
        "publications": [
            "publications", "papers", "research", "articles",
        ],
        "languages": [
            "languages", "spoken languages", "language proficiency",
        ],
        "interests": [
            "interests", "hobbies", "activities", "extracurricular",
        ],
    }

    def parse(self, pdf_bytes: bytes) -> dict:
        """
        Parse a PDF and return structured data.
        Returns:
            {
                "raw_text": str,
                "cleaned_text": str,
                "sections": dict,
                "word_count": int,
                "char_count": int,
                "page_count": int,
                "has_tables": bool,
                "has_images": bool,
            }
        """
        raw_text = self._extract_text(pdf_bytes)
        cleaned = self._clean_text(raw_text)
        sections = self._detect_sections(cleaned)
        has_tables, has_images = self._detect_formatting(pdf_bytes)

        return {
            "raw_text": raw_text,
            "cleaned_text": cleaned,
            "sections": sections,
            "word_count": len(cleaned.split()),
            "char_count": len(cleaned),
            "page_count": self._get_page_count(pdf_bytes),
            "has_tables": has_tables,
            "has_images": has_images,
        }

    # ------------------------------------------------------------------ #
    #  Private helpers                                                      #
    # ------------------------------------------------------------------ #

    def _extract_text(self, pdf_bytes: bytes) -> str:
        """Extract raw text from PDF bytes using PyMuPDF."""
        text_parts = []
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            for page in doc:
                text_parts.append(page.get_text("text"))
        return "\n".join(text_parts)

    def _clean_text(self, text: str) -> str:
        """Remove noise, fix spacing, and normalize unicode."""
        # Normalize unicode dashes/bullets
        text = text.replace("\u2013", "-").replace("\u2014", "-")
        text = text.replace("\u2022", "•").replace("\uf0b7", "•")
        text = text.replace("\u00a0", " ")

        # Collapse excessive whitespace/blank lines
        lines = [line.strip() for line in text.splitlines()]
        lines = [l for l in lines if l]  # remove empty
        text = "\n".join(lines)

        # Remove non-printable characters
        text = re.sub(r"[^\x20-\x7E\n•]", " ", text)
        text = re.sub(r" {2,}", " ", text)
        return text.strip()

    def _detect_sections(self, text: str) -> dict:
        """
        Identify resume sections by matching header keywords.
        Returns a dict of { section_name: content_text }.
        """
        lines = text.splitlines()
        sections: dict[str, list[str]] = {}
        current_section: Optional[str] = "header"
        sections["header"] = []

        for line in lines:
            stripped = line.strip()
            lower = stripped.lower().rstrip(":").strip()
            matched = self._match_section(lower)
            if matched:
                current_section = matched
                if current_section not in sections:
                    sections[current_section] = []
            else:
                if stripped:
                    sections[current_section].append(stripped)

        # Convert lists to strings
        return {k: "\n".join(v) for k, v in sections.items() if v}

    def _match_section(self, header_text: str) -> Optional[str]:
        """Return the canonical section name for a given header line."""
        for section, keywords in self.SECTION_HEADERS.items():
            if header_text in keywords:
                return section
        return None

    def _detect_formatting(self, pdf_bytes: bytes) -> tuple[bool, bool]:
        """Detect tables and images (complex formatting that hurts ATS)."""
        has_tables = False
        has_images = False
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            for page in doc:
                if page.get_images():
                    has_images = True
                # Heuristic: many stacked small rects → likely table
                rects = page.get_drawings()
                if len(rects) > 15:
                    has_tables = True
        return has_tables, has_images

    def _get_page_count(self, pdf_bytes: bytes) -> int:
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            return len(doc)
