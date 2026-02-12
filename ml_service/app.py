from flask import Flask, request, jsonify
from model import AnomalyDetector
import requests
import datetime

app = Flask(__name__)
detector = AnomalyDetector()

# Configuration
NTFY_TOPIC = "smart_owl_alerts" # Default topic, change as needed
NTFY_URL = f"https://ntfy.sh/{NTFY_TOPIC}"

@app.route('/data', methods=['POST'])
def receive_data():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        # Log data for future training
        detector.log_data(data)
        
        # Check for anomaly
        prediction, message = detector.predict(data)
        
        if prediction == -1:
            print(f"ANOMALY DETECTED: {message}")
            # Trigger Notification
            send_notification(f"Anomaly Detected! {message}")
            return jsonify({"status": "success", "anomaly": True, "message": message})
        else:
            return jsonify({"status": "success", "anomaly": False, "message": "Normal"})
            
    except Exception as e:
        print(f"Error processing data: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/train', methods=['POST'])
def train_model():
    success = detector.train()
    if success:
        return jsonify({"status": "success", "message": "Model trained successfully."})
    else:
        return jsonify({"status": "error", "message": "Training failed or not enough data."}), 400

@app.route('/config', methods=['POST'])
def update_config():
    global NTFY_TOPIC, NTFY_URL
    data = request.json
    if 'topic' in data:
        NTFY_TOPIC = data['topic']
        NTFY_URL = f"https://ntfy.sh/{NTFY_TOPIC}"
        return jsonify({"status": "success", "message": f"Updated notification topic to {NTFY_TOPIC}"})
    return jsonify({"status": "error", "message": "No topic provided"}), 400

def send_notification(message):
    try:
        requests.post(NTFY_URL,
            data=message.encode('utf-8'),
            headers={
                "Title": "Owl Anomaly Alert",
                "Priority": "high",
                "Tags": "warning,owl"
            })
        print(f"Notification sent to {NTFY_URL}")
    except Exception as e:
        print(f"Failed to send notification: {e}")

if __name__ == '__main__':
    app.run(port=5000, debug=True)
