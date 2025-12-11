# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

app = FastAPI(title="PCWise Backend")

# -------------------------
# CORS (Allow all origins)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # You can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Pydantic Model
# -------------------------
class ChatRequest(BaseModel):
    user: str
    message: str

# -------------------------
# Root endpoints
# -------------------------
@app.get("/")
def root():
    return {"message": "PCWise Backend Running ✅"}

@app.head("/")
def root_head():
    return {}

# -------------------------
# Chatbot Endpoint
# -------------------------
@app.post("/chat")
async def chat(request: ChatRequest):
    # Import Gemini here to prevent startup hanging
    try:
        from google import genai
    except ImportError:
        return JSONResponse(
            {"response": "Gemini library not installed."}, status_code=500
        )

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        return JSONResponse(
            {"response": "Gemini API key not set in environment variables."}, status_code=500
        )

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print("Error initializing Gemini client:", e)
        return JSONResponse(
            {"response": "Error initializing AI client."}, status_code=500
        )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=request.message
        )
        reply = response.text
    except Exception as e:
        print("Gemini error:", e)
        reply = "Sorry, I couldn't process your request."

    return {"response": reply}
