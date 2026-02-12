# 🦉 Smart Owl Platform

**The Ultimate Dual-Purpose IoT System: Safe Nursery Monitoring & Interactive Kids Arcade.**

Welcome to the Smart Owl Platform! This project turns a single device into a smart hub that keeps your child safe while they sleep and entertains them when they wake up.

---

## 🚀 ONE-CLICK STARTUP (Recommended)

We have automated the entire startup process. You do **NOT** need to open multiple terminals manually.

1.  **Locate the File**: Find `start_owl.bat` in the main project folder.
2.  **Double-Click It**: This will automatically open three windows:
    *   **ML Service**: The AI Brain.
    *   **Backend Server**: The data connector.
    *   **Frontend Client**: The visual dashboard.
3.  **Go to Dashboard**: Open your browser and visit **[http://localhost:5173](http://localhost:5173)**.

*That's it! The system is now running.*

---

## 🌟 Key Features

### 1. 🛡️ Parent Mode (Safety Monitoring)
A professional-grade dashboard for monitoring the nursery environment.
*   **Live Metrics**: Real-time tracking of **Temperature**, **Humidity**, and **Air Quality (Gas)**.
*   **Motion Tracking**: Detects movement in the room. The system is smart enough to distinguish between:
    *   *Normal Activity*: Occasional movement.
    *   *High Motion Events*: Sustained activity that triggers a specific alert (e.g., "High Motion Detected! Check Camera").
*   **Smart Alerts**: Instant warnings for environmental hazards (e.g., "High Gas Levels Detected!").
*   **History Graphs**: Visual charts showing trends over time.

### 2. 🎮 Kids Mode (Interactive Arcade)
Transforms the system into a fun, educational playground using the **Makey Makey** kit.
*   **Virtual Piano**: Play music using the keyboard (Arrow Keys + Space).
*   **Virtual Drums**: Connect bananas, play-dough, or any conductive object to the Makey Makey to create a physical drum kit!
*   **Engaging Visuals**: Bright, colorful animations designed for children.

### 3. 🧠 AI Anomaly Detection (The "Brain")
The system uses a **Machine Learning** service (Python + Scikit-Learn) to learn the "normal" patterns of your room.
*   **It Learns**: It constantly observes temperature, gas, and humidity levels.
*   **It Detects**: If a value spikes unexpectedly (e.g., gas levels rising without a known cause), it flags it as an anomaly.
*   **It Identifies**: It tells you *exactly* what is wrong:
    *   `"High Motion Detected!"`
    *   `"High Gas Levels Detected!"`
    *   `"High Temperature Detected!"`
    *   `"High Humidity Detected!"`

---

## 📱 How to Get Mobile Notifications

The system sends push notifications to your phone using **ntfy.sh**.

1.  **Install the App**: Download **Ntfy** on iOS or Android.
2.  **Subscribe**:
    *   Open the app and click standard **+** (plus).
    *   Enter topic name: **`smart_owl_alerts`**.
    *   Click **Subscribe**.
3.  **Test It**: When an anomaly occurs (like high gas or motion), your phone will buzz immediately!

---

## 🛠️ Manual Setup (Advanced)

If you prefer to run things manually or need to debug, follow these steps.

### Prerequisites
*   Node.js (v16 or higher)
*   Python (v3.8 or higher)
*   Arduino connected via USB

### 1. Start the ML Service
This is the AI brain. It needs to run first.
```bash
cd ml_service
pip install -r requirements.txt  # Run this once to install tools
python app.py
```

### 2. Start the Backend Server
This connects to the Arduino.
```bash
cd server
npm install  # Run this once
node index.js
```

### 3. Start the Frontend Website
This is the dashboard you see.
```bash
cd client
npm install  # Run this once
npm run dev
```

---

## 📂 Project Structure

*   **`client/`**: The React Website (Frontend). Visuals, dashboard, graphs.
*   **`server/`**: The Node.js Backend. Reads data from USB, sends it to the website and AI.
*   **`ml_service/`**: The Python AI.
    *   `app.py`: The web server listening for data.
    *   `model.py`: The AI logic (Isolation Forest + Motion Tracker).
    *   `sensor_data.csv`: The "memory" file where historical data is stored.
*   **`start_owl.bat`**: The automation script to run everything at once.

---

## ❓ Troubleshooting

*   **"Port Already in Use"**: You might have old terminals open. Close all terminal windows and try running `start_owl.bat` again.
*   **No Alerts?**: Make sure you subscribed to `smart_owl_alerts` in the Ntfy app.
*   **No Data?**: Check if your Arduino is plugged in. The `server` window will show "Serial Port Opened" if it connects successfully.
