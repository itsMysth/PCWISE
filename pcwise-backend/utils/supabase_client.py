from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def store_message(user, user_message, bot_reply):
    try:
        supabase.table("messages").insert({
            "sender_id": user,
            "receiver_id": "bot",
            "content": f"User: {user_message}\nBot: {bot_reply}"
        }).execute()
    except Exception as e:
        print("Supabase insert error:", e)
