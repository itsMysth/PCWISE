# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = FastAPI(title="PCWise Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"message": "PCWise Backend Running ✅"}

SYSTEM_INSTRUCTION = (
    "You are an expert PC Building Consultant for the Philippine market (PH). "
    "Focus on component compatibility, performance, and budget in Philippine Pesos (₱). "
    "Always format responses using Markdown for readability."
)

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set")
        _client = genai.Client(api_key=api_key)
    return _client

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        client = get_client()
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=request.message,
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION
            )
        )
        reply = response.text

    except Exception as e:
        err = str(e)
        print("Gemini error:", err)

        if "RESOURCE_EXHAUSTED" in err or "429" in err:
            reply = "⚠️ AI quota exceeded. Please try again later."
        else:
            reply = "Sorry, I couldn't process your request."

    return {"response": reply}
