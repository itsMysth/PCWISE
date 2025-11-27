# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from google import genai
from utils.supabase_client import store_message

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
# Gemini Client
# -------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

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
    try:
        # Gemini response
        response = client.models.generate_content(
            model="gemini-2.0-flash",     # You may switch to flash
            contents=request.message
        )
        reply = response.text
    except Exception as e:
        print("Gemini error:", e)
        reply = "Sorry, I couldn't process your request."

    # Store chat to Supabase
    try:
        store_message(request.user, request.message, reply)
    except Exception as e:
        print("Supabase error:", e)

    return JSONResponse({"response": reply})
