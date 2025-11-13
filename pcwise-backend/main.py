from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from google import genai
from utils.supabase_client import store_message

# Load environment variables
load_dotenv()

app = FastAPI(title="PCWise Backend")

# ----------------------
# CORS Setup
# ----------------------
# Allow all origins dynamically (works with any Vercel frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, you can replace "*" with allowed URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------
# Gemini Client
# ----------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

# ----------------------
# Request Model
# ----------------------
class ChatRequest(BaseModel):
    user: str
    message: str

# ----------------------
# Root Endpoint
# ----------------------
@app.get("/")
def root():
    return {"message": "PCWise Backend Running ✅"}

# ----------------------
# Optional: handle HEAD requests to silence 405 logs
# ----------------------
@app.head("/")
def head_root():
    return {}

# ----------------------
# Chat Endpoint
# ----------------------
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Send message to Gemini NLP API
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=request.message
        )
        reply = response.text
    except Exception as e:
        print("Gemini error:", e)
        reply = "Sorry, I couldn't process your request."

    # Store conversation in Supabase (async-safe)
    try:
        store_message(request.user, request.message, reply)
    except Exception as e:
        print("Supabase error:", e)

    return JSONResponse({"response": reply})
