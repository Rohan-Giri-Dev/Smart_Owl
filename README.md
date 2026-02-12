# 🦉 Smart Owl Platform

**Smart Monitoring for Parents. Interactive Fun for Kids.**

The Smart Owl Platform is a complete IoT solution that transforms a single device into:
1.  **A Safety Monitor**: Detecting fire, gas, and intruders in real-time.
2.  **A Musical Arcade**: Letting kids play virtual drums and piano using everyday objects (via Makey Makey).

---

## 🚀 Quick Start (One-Click)

**You do NOT need to run complex commands.**

1.  **Connect Hardware**: Plug your Arduino and Sensors into the computer.
2.  **Run the Script**: Double-click the file named **`start_owl.bat`**.
    *   *This will automatically start the AI Brain, the Server, and the Dashboard.*
3.  **View Dashboard**: Open your browser to **[http://localhost:5173](http://localhost:5173)**.

---

## 📱 Features

### 🛡️ For Parents
*   **Live Monitoring**: See Temperature, Humidity, and Air Quality instantly.
*   **Smart Alerts**: Get notified on your phone (via **ntfy.sh**) if:
    *   Gas levels rise (Fire hazard).
    *   There is too much motion (Intruder/Baby awake).
    *   The room gets too hot or humid.
*   **AI Power**: The system *learns* what is normal for your room and only alerts you when something is truly wrong.

### 🎮 For Kids
*   **Virtual Piano**: Use the keyboard to play music.
*   **Virtual Drums**: Hook up bananas or play-dough to the **Makey Makey** and turn them into a drum kit!

---

## 🛠️ Installation Requirements

If running for the first time, you need:
*   **Node.js** (Installed)
*   **Python** (Installed)
*   **Internet** (For initial setup and notifications)

### First-Time Setup (Only once)
Open a terminal in the project folder and run:
```bash
# Install AI dependencies
cd ml_service
pip install -r requirements.txt

# Install Backend dependencies
cd ../server
npm install

# Install Frontend dependencies
cd ../client
npm install
```
*After doing this once, you can always just use `start_owl.bat`.*

---

## 📂 Project Structure
*   **`Project_Documentation.md`**: Read this for a deep dive into the logic and code architecture.
*   **`start_owl.bat`**: The magic script that runs everything.
*   **`client/`**: The visual website code.
*   **`server/`**: The code that talks to the Arduino.
*   **`ml_service/`**: The Python AI code.

---

*Made with ❤️ for the Smart Owl Project.*
