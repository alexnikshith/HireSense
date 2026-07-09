import io
import re
from pdfminer.high_level import extract_text

class ResumeParser:
    """Parses PDF resumes using pdfminer.six (Ultra-Light for Cloud)."""

    def parse_pdf(self, file_bytes: bytes) -> dict:
        try:
            # Extract text using pdfminer
            text = extract_text(io.BytesIO(file_bytes))
            
            # Basic cleaning
            clean_text = self._clean_text(text)
            
            # Detect sections and formatting
            sections = self._detect_sections(clean_text)
            formatting = self._check_formatting(text)
            word_count = len(clean_text.split())

            return {
                "text": clean_text,
                "sections": sections,
                "formatting_issues": formatting,
                "page_count": 1,
                "word_count": word_count,
                "has_tables": "\t" in clean_text,
                "has_images": False # Hard to detect with text-only extraction
            }
        except Exception as e:
            raise Exception(f"PDF Parsing Error: {str(e)}")

    def _clean_text(self, text: str) -> str:
        # Remove null bytes and excessive whitespace
        text = text.replace('\x00', '')
        text = re.sub(r'\n\s*\n', '\n', text)
        return text.strip()

    def _detect_sections(self, text: str) -> dict:
        sections = {}
        headers = {
            "experience": ["experience", "work history", "employment"],
            "education": ["education", "academic", "qualifications"],
            "skills": ["skills", "technical skills", "competencies"],
            "projects": ["projects", "personal projects", "key projects"],
            "summary": ["summary", "profile", "objective"]
        }
        
        current_section = "intro"
        section_content = []
        
        for line in text.splitlines():
            line_lower = line.lower().strip()
            found_header = False
            for sec, keywords in headers.items():
                if any(k == line_lower for k in keywords) or \
                   (len(line_lower) < 20 and any(k in line_lower for k in keywords)):
                    sections[current_section] = "\n".join(section_content)
                    current_section = sec
                    section_content = []
                    found_header = True
                    break
            
            if not found_header:
                section_content.append(line)
        
        sections[current_section] = "\n".join(section_content)
        return sections

    def _check_formatting(self, raw_text: str) -> list[str]:
        issues = []
        # Basic heuristic for formatting issues in text-only extraction
        if len(raw_text.strip()) < 100:
            issues.append("Low text density (Resume might be an image/scan)")
        return issues
