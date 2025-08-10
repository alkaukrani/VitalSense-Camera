import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY', 'your_groq_api_key_here')
VAPI_API_KEY = os.getenv('VAPI_API_KEY', 'your_vapi_api_key_here') 