from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from utils.supabase_client import store_message

app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user: str
    message: str

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT = "https://api.openai.com/v1/responses"  # adjust if needed

@app.get("/")
def root():
    return {"message": "PCWise Backend Running"}

@app.post("/chat")
def chat(request: ChatRequest):
    # Send message to Gemini NLP API
    payload = {
        "model": "gemini-2.5",
        "input": request.message
    }
    headers = {
        "Authorization": f"Bearer {GEMINI_API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post(GEMINI_ENDPOINT, json=payload, headers=headers)
    
    if response.status_code == 200:
        reply = response.json()["output_text"]  # adjust based on actual Gemini API response
    else:
        reply = "Sorry, I couldn't process your request."

    # Store chat in Supabase
    store_message(request.user, request.message, reply)

    return {"response": reply}
