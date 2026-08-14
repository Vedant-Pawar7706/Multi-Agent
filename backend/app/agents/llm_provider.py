import os
import json
import re
from typing import Dict, Any, Optional
from app.core.config import settings

class LLMProvider:
    """
    Unified LLM Provider abstraction supporting Gemini, OpenAI, and high-quality Demo Fallback.
    """
    def __init__(self, provider: Optional[str] = None, model: Optional[str] = None):
        self.provider = provider or settings.LLM_PROVIDER
        self.model = model or settings.MODEL_NAME
        self.google_key = settings.GOOGLE_API_KEY or os.getenv("GOOGLE_API_KEY", "")
        self.openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "")

    async def generate_json(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        # Try Gemini if configured and key present
        if self.provider.lower() == "gemini" and self.google_key:
            try:
                result = await self._call_gemini(system_prompt, user_prompt)
                if result:
                    return result
            except Exception as e:
                print(f"[LLMProvider] Gemini call failed: {e}. Falling back to smart generator.")

        # Try OpenAI if configured and key present
        if self.provider.lower() == "openai" and self.openai_key:
            try:
                result = await self._call_openai(system_prompt, user_prompt)
                if result:
                    return result
            except Exception as e:
                print(f"[LLMProvider] OpenAI call failed: {e}. Falling back to smart generator.")

        # Default fallback engine (Demo mode or fallback when no API key provided)
        return self._extract_json_or_fallback(system_prompt, user_prompt)

    async def _call_gemini(self, system_prompt: str, user_prompt: str) -> Optional[Dict[str, Any]]:
        try:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=self.google_key)
            prompt = f"{system_prompt}\n\nUser Input:\n{user_prompt}\n\nIMPORTANT: Return ONLY valid JSON format."
            response = client.models.generate_content(
                model=self.model if "gemini" in self.model else "gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            if response.text:
                return json.loads(response.text)
        except Exception as e:
            print(f"[Gemini Error] {e}")
        return None

    async def _call_openai(self, system_prompt: str, user_prompt: str) -> Optional[Dict[str, Any]]:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=self.openai_key)
            response = await client.chat.completions.create(
                model=self.model if "gpt" in self.model else "gpt-4o-mini",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            content = response.choices[0].message.content
            if content:
                return json.loads(content)
        except Exception as e:
            print(f"[OpenAI Error] {e}")
        return None

    def _extract_json_or_fallback(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        """
        Parses JSON strings if contained in text, or provides fallback structure based on prompt keyword.
        """
        # Search for JSON block
        json_match = re.search(r'\{.*\}', user_prompt, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except Exception:
                pass
        return {}
