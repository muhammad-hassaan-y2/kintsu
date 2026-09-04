import sys
import os

# Insert server directory into Python path so imports work seamlessly on Vercel
server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "server"))
if server_dir not in sys.path:
    sys.path.insert(0, server_dir)

from main import app
