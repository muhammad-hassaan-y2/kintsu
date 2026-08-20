import os
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", 8000))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "*")
JWT_SECRET = os.getenv("JWT_SECRET", "kintsu_restart_secret_key_2026")
