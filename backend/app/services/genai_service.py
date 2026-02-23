from typing import Dict, Any
from app.services.llm_engine import llm_engine

class GenAIService:
    def generate_insight(self, eda_summary: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates structured insights using the LLMEngine.
        """
        return llm_engine.generate_report(eda_summary)

genai_service = GenAIService()
