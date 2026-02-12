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

*This documentation serves as the technical blueprint for the Smart Owl Platform.*
