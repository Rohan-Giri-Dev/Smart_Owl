# 🦉 Smart Owl Platform: Technical Documentation

## 1. Project Overview & Core Concept
The **Smart Owl Platform** is an innovative Dual-Purpose IoT System designed for modern smart homes. It addresses two distinct user needs using a single hardware hub:
1.  **Safety & Monitoring (Parent Mode)**: A robust environmental monitoring system for nurseries.
2.  **Interactive Play (Kids Mode)**: An engaging digital arcade that turns physical objects into musical instruments.

The core philosophy is efficiency: Why buy separate devices for monitoring and play when one intelligent hub can do both?

---

## 2. System Architecture & Logic flow

The system follows a microservices-inspired architecture, ensuring that the AI processing doesn't slow down the real-time dashboard.

### A. The Hardware Layer (The Senses)
*   **Controller**: Arduino Uno/Mega.
*   **Sensors**:
    *   `DHT11/22`: Measures heat and humidity.
    *   `MQ-135`: Detects air quality (smoke, gas, alcohol).
    *   `PIR Motion`: Detects movement.
*   **Input**: `Makey Makey` kit (simulates keyboard presses for the arcade).

### B. The Backend Server (The Nervous System)
*   **Technology**: Node.js + Express.
*   **Role**:
    1.  Reads raw data from the Arduino via USB Serial connection.
    2.  Parses the data strings (e.g., `"T:24,H:60,G:120"`).
    3.  Broadcasts this data in *real-time* to the Frontend via `Socket.IO`.
    4.  Simultaneously forwards the data to the ML Service via HTTP for analysis.
    5.  Controls hardware actuators (optional relays/LEDs) based on logic rules.

### C. The Machine Learning Service (The Brain)
*   **Technology**: Python + Flask + Scikit-Learn.
*   **Logic**:
    *   **Anomaly Detection**: Uses the `Isolation Forest` algorithm. It learns the "shape" of normal data over time. If a data point falls outside this learned shape (e.g., a sudden gas spike), it is flagged as an anomaly.
    *   **Motion Tracking**: Implements a `MotionTracker` logic (Sliding Window). It monitors the density of motion events. A single movement is ignored, but sustained movement (e.g., 10 events in 20 seconds) triggers a specific "High Motion" alert.
    *   **Classification**: When an anomaly is detected, the logic checks specific sensor thresholds to classify the event as "Fire", "High Humidity", or "Intruder" (Motion), providing specific actionable alerts.

### D. The Frontend (The Face)
*   **Technology**: React.js + Tailwind CSS.
*   **Modes**:
    *   **Parent Dashboard**: Professional data visualization, history charts, and health indicators.
    *   **Kids Playground**: Colorful, animated interface for the Virtual Piano and Drums.

---

## 3. Detailed Logic & Decision Making

The system makes autonomous decisions based on sensor inputs:

| Scenario | Sensor Input | System Logic | Action Taken |
| :--- | :--- | :--- | :--- |
| **Normal Day** | Temp: 24°C, Gas: 100 | Data matches historical "normal" patterns. | Log data. displayed on dashboard (Green Status). |
| **Fire/Smoke** | Gas > 300 | Deviation from normal pattern detected. | **Alert**: "High Gas Levels Detected!". Notification sent to phone. |
| **Intruder** | Motion: High Freq | Motion density exceeds threshold (10/20 window). | **Alert**: "High Motion Activity!". Notification sent to phone. |
| **Stuffy Room**| Temp > 30°C | Temperature exceeds comfort threshold. | **Alert**: "High Temperature". Auto-fan logic (if connected) triggers. |
| **Play Time** | Keyboard Input | Makey Makey detects fruit/dough touch. | Frontend plays corresponding drum/piano sound and animation. |

---

## 4. Setup & Deployment

### Automated Startup
We utilize a batch script (`start_owl.bat`) to orchestrate the startup of all three subsystems (Python ML, Node Server, React Client) simultaneously.

### Connectivity
-   **Serial**: 9600 Baud Rate.
-   **WebSockets**: Port 3000.
-   **ML API**: Port 5000.
-   **Dashboard**: Port 5173.

---

## 5. Technology Stack & Tools

This platform relies on a modern, event-driven tech stack to ensure real-time performance and easy extensibility.

### Frontend (The Dashboard)
- **React.js (Vite)**: Used for building a fast, interactive user interface. We chose Vite for its lightning-fast hot reloading during development.
- **Tailwind CSS**: A utility-first CSS framework that allows us to style the dashboard rapidly without writing custom CSS files. It handles responsiveness and theming (Dark/Light mode).
- **Socket.IO-Client**: The library that keeps a persistent connection open with the server, allowing the dashboard to update *instantly* when sensor data changes, without needing to refresh the page.
- **Lucide React**: Provides the clean, consistent icons used throughout the UI.
- **Recharts**: A charting library used to render the live environmental graphs.

### Backend (The Edge Server)
- **Node.js**: The runtime environment executing our JavaScript server code. It was chosen for its non-blocking I/O, which is perfect for handling multiple data streams (Serial + WebSockets + HTTP) simultaneously.
- **Express.js**: A minimal web framework for Node.js used to handle HTTP routes (e.g., serving the app).
- **Socket.IO**: The server-side WebSocket library that broadcasts sensor data to all connected clients (web browsers).
- **SerialPort**: The critical bridge between software and hardware. It opens a communication channel to the Arduino via USB to read raw byte streams.
- **Node-RTSP-Stream**: Converts the RTSP video stream from the IP camera into a WebSocket stream that can be displayed in a web browser canvas (JSMpeg).

### Machine Learning Service (The Intelligence)
- **Python (Flask)**: We use Python because of its rich data science ecosystem. Flask creates a lightweight API that the Node.js server can talk to.
- **Scikit-Learn**: The core ML library. We use the **Isolation Forest** algorithm for unsupervised anomaly detection because it's efficient at identifying "outliers" (anomalies) in high-dimensional datasets without needing labeled training data.
- **Pandas**: Used for structuring the incoming JSON data into DataFrames for the model to process.
- **Joblib**: Used to save (pickle) the trained model to a file (`model.pkl`) so it doesn't need to retrain every time the server restarts.

### Hardware
- **Arduino Uno**: The microcontroller that interfaces with the physical world. It runs a C++ sketch to poll sensors and print data to Serial.
- **Sensors**: MQ-135 (Gas/Air Quality), DHT11 (Temp/Humidity), PIR (Motion).
- **Makey Makey**: A unique HID (Human Interface Device) that tricks the computer into thinking everyday objects are keyboard keys (Space, Arrow Keys), enabling the "Fruit Piano" feature.

---

## 6. End-to-End Data Flow (How notifications reach your phone)

The most critical safety feature is the ability to alert you anywhere. Here is the step-by-step journey of a single data packet:

1.  **Sensing**: The **MQ-135** sensor detects a rise in smoke levels.
2.  **Digitization**: The **Arduino** reads this analog voltage, converts it to a number (e.g., `350`), and prints the string `GAS:350` to the USB Serial port.
3.  **Ingestion**: The **Node.js Server** is listening to that Serial port. It captures the string `GAS:350` and parses it into a JSON object: `{ gas: 350 }`.
4.  **Analysis Request**: The Node.js server immediately sends this JSON payload via an HTTP POST request to the **Python ML Service** (`http://localhost:5000/data`).
5.  **Intelligence Check**:
    *   The Python service feeds `{ gas: 350 }` into the loaded **Isolation Forest** model.
    *   The model compares this value against the historical "normal" baseline.
    *   Since 350 is significantly higher than the usual 100, the model returns: `Prediction: -1 (Anomaly)`.
6.  **Notification Trigger**:
    *   Upon detecting the anomaly, the Python script executes the `send_notification()` function.
    *   It constructs a POST request to `https://ntfy.sh/smart_owl_alerts` with the message: *"Anomaly Detected! High Gas Levels"*.
7.  **Delivery**:
    *   The **ntfy.sh** server receives this request.
    *   It immediately pushes a notification to any phone subscribed to the `smart_owl_alerts` topic via the ntfy app.
8.  **Result**: Your phone buzzes with the alert within seconds of the smoke detection.

---

*This documentation serves as the technical blueprint for the Smart Owl Platform.*
