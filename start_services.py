import time
import requests
import subprocess
import signal
import os
import sys

def check_server_health():
    """Check backend server health status"""
    try:
        response = requests.get('http://localhost:8000/health')
        if response.status_code == 200:
            return True
    except requests.ConnectionError:
        return False
    return False

def signal_handler(sig, frame):
    """Handle exit signals"""
    print('Stopping services...')
    backend_process.send_signal(signal.SIGINT)
    frontend_process.send_signal(signal.SIGINT)
    backend_process.wait()
    frontend_process.wait()
    print('Services stopped.')
    sys.exit(0)

# Start backend service
backend_process = subprocess.Popen(["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"])

# Wait for backend service to start
print("Waiting for the server to start...")
while not check_server_health():
    print("Server not started yet, continuing to wait...")
    time.sleep(1)

print("Server started, starting frontend...")

# Start frontend service
frontend_process = subprocess.Popen(["npm", "start"], cwd="frontend")

# Set up signal handler
signal.signal(signal.SIGINT, signal_handler)

print('Services started. Press Ctrl+C to stop.')

# Keep main process running
try:
    while True:
        signal.pause()
except (KeyboardInterrupt, SystemExit):
    signal_handler(None, None)
