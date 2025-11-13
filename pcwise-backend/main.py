from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from google import genai
from utils.supabase_client import store_message

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # change when deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

# Request model
class ChatRequest(BaseModel):
    user: str
    message: str

@app.get("/")
def root():
    return {"message": "PCWise Backend Running ✅"}

@app.post("/chat")
def chat(request: ChatRequest):
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

    # Store conversation in Supabase
    store_message(request.user, request.message, reply)

    return {"response": reply}
