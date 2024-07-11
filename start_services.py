import subprocess
import signal
import os
import sys

# 启动后端服务
backend_process = subprocess.Popen(["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"])

# 启动前端服务
frontend_process = subprocess.Popen(["npm", "start"], cwd="frontend")

def signal_handler(sig, frame):
    print('Stopping services...')
    backend_process.send_signal(signal.SIGINT)
    frontend_process.send_signal(signal.SIGINT)
    backend_process.wait()
    frontend_process.wait()
    print('Services stopped.')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

print('Services started. Press Ctrl+C to stop.')

# 保持主进程运行
try:
    while True:
        signal.pause()
except (KeyboardInterrupt, SystemExit):
    signal_handler(None, None)
