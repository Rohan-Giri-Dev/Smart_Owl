import requests
import time
import json

URL = "http://localhost:5000/data"

def send_data(data):
    try:
        response = requests.post(URL, json=data)
        return response.json()
    except Exception as e:
        return {"error": str(e)}

print("--- Testing Normal Data ---")
print(send_data({"temp": 25, "humidity": 50, "gas": 100, "motion": 0}))

print("\n--- Testing High Gas (>300) ---")
# Send a few times to log data, then one outlier
print(send_data({"temp": 25, "humidity": 50, "gas": 500, "motion": 0}))

print("\n--- Testing High Temp (>35) ---")
print(send_data({"temp": 40, "humidity": 50, "gas": 100, "motion": 0}))

print("\n--- Testing High Humidity (>80) ---")
print(send_data({"temp": 25, "humidity": 90, "gas": 100, "motion": 0}))

print("\n--- Testing High Motion (Density) ---")
# Reset motion tracker by sending 0s? No, it's a sliding window.
# Just send enough 1s to trigger threshold (10).
for i in range(12):
    res = send_data({"temp": 25, "humidity": 50, "gas": 100, "motion": 1})
    print(f"Motion {i+1}: {res.get('message', 'No Message')}")
    if res.get('anomaly'):
        break
