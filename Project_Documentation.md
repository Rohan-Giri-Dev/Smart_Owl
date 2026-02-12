SMART OWL PLATFORM - PROJECT DOCUMENTATION
==========================================

1. PROJECT OVERVIEW
-------------------
The **Smart Owl Platform** is a dual-purpose Internet of Things (IoT) system designed for modern families. It acts as an intelligent hub that serves two distinct needs:
1.  **Parent Safety**: Real-time environmental monitoring for a child's nursery.
2.  **Child Play**: An interactive digital arcade that turns everyday objects into musical instruments.

All of this is powered by a single device using an Arduino microcontroller, communicating with a sophisticated web application on your computer.

2. PURPOSE
----------
The goal of this project is to bridge the gap between "smart home" utility and "educational play." Instead of having separate devices for baby monitoring and creative play, the Smart Owl combines them. It ensures safety when the child is sleeping and creativity when they are awake.

3. KEY FEATURES
---------------

### A. Parent Mode (Safety Monitoring)
This mode provides a dashboard for parents to monitor the room's conditions:
- **Temperature & Humidity**: Ensures the room is comfortable.
- **Gas / Air Quality**: Detects hazardous gases or poor ventilation.
- **Motion Detection**: Alerts if there is movement in the room (tracks both presence and excessive motion).
- **Health Status**: Simple Green/Orange/Red indicators for quick status checks.
- **History Charts**: Graphs showing environmental trends over time.

### B. Kids Mode (Interactive Arcade)
This mode transforms the system into a fun playground using the **Makey Makey** kit:
- **Virtual Piano**: Use keyboard keys (Arrow Keys, Space) to play music.
- **Virtual Drums**: Connect bananas, play-dough, or any conductive object to the Makey Makey to trigger drum sounds on the screen.
- **Engaging Visuals**: Bright colors and animations designed for children.

### C. Smart Anomaly Detection (The "Brain")
The system includes an Artificial Intelligence (AI) component that learns the room's normal patterns.
- **Learning**: It "studies" the temperature, gas, and humidity levels over time.
- **Detecting**: If it sees a spike (e.g., gas levels jump significantly), it flags it as an "Anomaly."
- **Classifying**: It identifies *why* the alert happened: "High Motion", "High Gas", "High Temp", or "High Humidity".
- **Alerting**: It sends an immediate notification to your phone with the specific reason (e.g., "High Motion Detected! Check Camera").

4. TECHNOLOGY STACK
-------------------

The project is built using modern web and hardware technologies:

### 1. Hardware Layer
- **Arduino Uno/Mega**: The brain of the hardware, reading sensor data.
- **Sensors**:
    - **DHT11**: Measures Temperature and Humidity.
    - **MQ-135**: Measures Air Quality and Gas levels.
    - **PIR Sensor**: Detects Motion.
- **Makey Makey**: An invention kit for the Kids Mode inputs.

### 2. Backend Server (The Coordinator)
- **Node.js**: The runtime environment.
- **Express.js**: The web server framework.
- **Responsibilities**:
    - Reads raw data from the Arduino via USB (`serialport`).
    - Sends real-time data to the website (`socket.io`).
    - Forwards data to the AI service for analysis (`axios`).

### 3. Machine Learning Service (The Brain)
- **Python**: The programming language for AI.
- **Flask**: A lightweight web server for the AI model.
- **Scikit-learn**: The machine learning library (using **Isolation Forest** algorithm).
- **NTFY**: The service used to send push notifications to mobile phones (`requests`).

### 4. Frontend Website (The Interface)
- **React.js (Vite)**: The library for building the user interface.
- **Tailwind CSS**: For modern, responsive styling.
- **Recharts**: For drawing data graphs.

5. HOW IT WORKS (STEP-BY-STEP)
------------------------------

1.  **Sensing**: The Arduino reads data from the sensors every second (e.g., "Temp: 24°C, Gas: 150").
2.  **Transmission**: This data is sent via USB cable to the **Node.js Server**.
3.  **Broadcasting**: The Node.js Server instantly sends this data to the **React Website**, updating the dashboard numbers and charts live.
4.  **Analysis**: At the same time, the Node.js Server forwards the data to the **Python ML Service**.
5.  **Intelligence**:
    -   The Python service adds the data to its history (`sensor_data.csv`).
    -   If it has enough data, the AI model checks: "Is this data normal?"
    -   **Normal**: Do nothing but log it.
    -   **Abnormal**: If the Gas suddenly jumps to 800 (simulated fire), the AI marks it as an **Anomaly**.
6.  **Notification**: The Python service instantly sends a signal to **ntfy.sh**. Your phone, subscribed to the topic `smart_owl_alerts`, receives a "High Priority Alert" notification.

6. SETUP & USAGE
----------------

To run this system, you need three terminals open:

1.  **ML Service**: `cd ml_service` -> `python app.py` (Runs the AI)
2.  **Server**: `cd server` -> `node index.js` (Runs the Backend)
3.  **Client**: `cd client` -> `npm run dev` (Runs the Website)

### One-Click Startup (New!)
Instead of opening three terminals, you can now just double-click the **`start_owl.bat`** file in the project folder. It will open all necessary windows for you.

Once running, access the dashboard at `http://localhost:5173`.
To get mobile alerts, install the **Ntfy** app and subscribe to `smart_owl_alerts`.


------------------------------------------
Developed for the Smart Owl Platform Project


7. DEEP DIVE: THE INTELLIGENCE SYSTEM (ML SERVICE)
--------------------------------------------------

You asked: *"What is in the ml_service folder and what does the AI do?"*

The `ml_service` folder is the "Brain" of the operation. It is a separate mini-program written in **Python**. We use Python because it is the best language for Artificial Intelligence.

### The Files Inside `ml_service`:

1.  **`app.py` (The Messenger & Waiter)**
    *   **Purpose**: This is a web server (using **Flask**). It waits for data to be delivered.
    *   **What it does**:
        *   It opens a door at `http://localhost:5000`.
        *   When the Node.js server gets new sensor data, it "post" it to this door.
        *   `app.py` takes that data and hands it to the "Brain" (`model.py`).
        *   If the Brain says "DANGER!", `app.py` immediately calls the **Notification Service** to alert your phone.

2.  **`model.py` (The Brain)**
    *   **Purpose**: This is the actual Intelligence.
    *   **Tech Stack**: It uses a library called `scikit-learn` and an algorithm called **Isolation Forest**.
    *   **How it works (The Magic)**:
        *   **Training**: Imagine teaching a dog what "normal" behavior is. You show it 100 examples of a quiet room (Temp 22°C, Gas 120). The model memorizes this "shape" of normal data.
        *   **Prediction**: Now, a new data point comes in: (Temp 22°C, Gas 900). The model looks at its memory and sees this point is FAR outside the "normal shape."
        *   **Result**: It outputs `-1` (Anomaly). If the data is normal, it outputs `1`.

3.  **`sensor_data.csv` (The Memory)**
    *   **Purpose**: A simple text file that acts as the hard drive.
    *   **What it does**: Every time data comes in, it is written here. The AI reads this file to "learn" from the past. The more data in this file, the smarter the AI gets at knowing what your room is usually like.

4.  **`requirements.txt` (The Shopping List)**
    *   **Purpose**: A list of ingredients needed to run the Python code.
    *   **Content**: `flask`, `pandas`, `scikit-learn` (the AI tools).

### The Full AI Workflow (In Simple English):

1.  **DATA ARRIVES**: The main server sends: `{"gas": 150, "temp": 24}` to the Python App.
2.  **LOGGING**: The Python App writes this to `sensor_data.csv` ("Dear Diary, today gas was 150...").
3.  **THINKING**: The Python App asks the Brain (`model.py`): "Is this weird?"
4.  **DECISION**:
    *   The Brain compares `150` to its memory of thousands of past records.
    *   It checks for excessive motion using a "Motion Tracker" (sliding window).
    *   It sees that `150` is very close to the average `140` and motion is low.
    *   It answers: "Normal."
5.  **ACTION**: The App says "Okay" and does nothing.

**... BUT IF TOO MUCH MOTION HAPPENS:**

1.  **DATA ARRIVES**: `{"motion": 1}` repeatedly.
2.  **TRACKING**: The Motion Tracker counts: "That's 15 motions in the last 20 seconds!"
3.  **DECISION**: It triggers a "High Motion" alert.
4.  **NOTIFICATION**: "High Motion Detected! Check the Camera."

**... BUT IF FIRE HAPPENS:**

1.  **DATA ARRIVES**: `{"gas": 900, "temp": 50}`.
2.  **THINKING**: The Brain sees `900`. It has NEVER seen `900` before. It is way outside the "Normal Tree."
3.  **DECISION**: It screams: "ANOMALY! (-1)" and identifies the culprit (Gas > 300).
4.  **ACTION**: `app.py` sees the alarm. It creates a message: *"High Gas Levels Detected! Check Air Quality."*.
5.  **NOTIFICATION**: It sends this message to **ntfy.sh**, which instantly pops up on your phone.

