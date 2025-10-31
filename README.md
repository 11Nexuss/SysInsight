# \# SysInsight

# 

# A real-time system monitoring dashboard built with React + Flask. Monitor your CPU, memory, disk, processes, and network connections from a sleek modern UI.

# 

# \## Quick Start

# 

# \### Backend

# 

# ```bash

# cd backend

# pip install flask flask-cors psutil

# python app.py

# ```

# 

# Runs on `http://127.0.0.1:8000`

# 

# \### Frontend

# 

# ```bash

# cd frontend

# npm install

# npm run dev

# ```

# 

# Runs on `http://localhost:5173`

# 

# Open your browser and you're good to go.

# 

# \## What It Does

# 

# \*\*Dashboard Tab\*\*: See your CPU, memory, disk usage, CPU details, and resource graphs at a glance.

# 

# \*\*Processes Tab\*\*: Top 10 processes eating your CPU, sorted by usage. Shows PID, process name, and memory consumption.

# 

# \*\*Network Tab\*\*: All your established network connections. Shows local/remote addresses, connection status, and the process ID behind each connection.

# 

# \*\*System Info Tab\*\*: Hostname, platform, OS version, boot time, uptime, and all your hardware specs.

# 

# \## Tech Stack

# 

# \- \*\*Frontend\*\*: React 18 + Vite, Tailwind CSS, Lucide icons, Axios

# \- \*\*Backend\*\*: Flask, Flask-CORS, psutil

# \- \*\*Real-time Updates\*\*: Auto-refresh every 3 seconds

# 

# \## Project Layout

# 

# ```

# backend/

# &nbsp; └── app.py                 # Flask API

# 

# frontend/

# &nbsp; ├── src/

# &nbsp; │   ├── App.jsx

# &nbsp; │   ├── Dashboard.jsx      # Main dashboard component

# &nbsp; │   └── main.jsx

# &nbsp; ├── index.html

# &nbsp; └── vite.config.js

# ```

# 

# \## API

# 

# \### `GET /api/system`

# 

# Returns all system data:

# 

# ```json

# {

# &nbsp; "system": { "platform": "Windows", "hostname": "..." },

# &nbsp; "cpu": { "percent": 5.8, "cores": 6, ... },

# &nbsp; "memory": { "percent": 66.7, "total": 15.93, ... },

# &nbsp; "disk": { "percent": 45.2, "total": 238.47, ... },

# &nbsp; "processes": \[ { "pid": 1234, "name": "chrome.exe", ... } ],

# &nbsp; "network": \[ { "local\_address": "127.0.0.1:8000", ... } ]

# }

# ```

# 

# \### `GET /api/health`

# 

# Quick health check.

# 

# \## Backend Not Connected?

# 

# \- Make sure Flask is actually running (`python app.py`)

# \- Check it's on `http://127.0.0.1:8000`

# \- Open DevTools (F12) → Console and see if there's an error

# \- Hit the "Retry Connection" button

# \- Check your firewall isn't blocking port 8000

# 

# \## Frontend Features

# 

# \- Sidebar navigation with active tab highlighting

# \- Real-time status indicator (green = connected, red = disconnected)

# \- Manual refresh button

# \- Responsive design works on mobile

# \- Connection status in the footer

# \- Auto-reconnect on backend failure

# 

# \## Data Refresh

# 

# Frontend automatically fetches new data every 3 seconds. Click the Refresh button in the top bar to force an immediate update.

# 

# \## Notes

# 

# \- CORS is set to allow all origins (`"origins": \["\*"]`) for development. Tighten this for production.

# \- Process list shows top 10 sorted by CPU usage

# \- Network tab shows first 10 established connections

# \- CPU usage is sampled over 1 second intervals

