import requests
import time
import random

BASE_URL = "http://localhost:5000"

def send_data(temp, humidity, gas, motion):
    payload = {
        "temp": temp,
        "humidity": humidity,
        "gas": gas,
        "motion": motion
    }
    try:
        response = requests.post(f"{BASE_URL}/data", json=payload)
        print(f"Sent: {payload} | Response: {response.json()}")
    except Exception as e:
        print(f"Error sending data: {e}")

def run_simulation():
    print("1. Sending 'Normal' Data (Training Phase)...")
    for _ in range(50):
        # Normal conditions: Temp 20-25, Hum 40-60, Gas 100-200, Motion 0 or 1
        send_data(
            temp=random.uniform(20, 25),
            humidity=random.uniform(40, 60),
            gas=random.uniform(100, 200),
            motion=random.choice([0, 1])
        )
        # time.sleep(0.1) # Fast forward

    print("\n2. Training Model...")
    try:
        response = requests.post(f"{BASE_URL}/train")
        print(f"Train Response: {response.json()}")
    except Exception as e:
        print(f"Error training: {e}")

    print("\n3. Sending 'Anomaly' Data (Gas Spike)...")
    # Abnormal: High Gas
    send_data(
        temp=24.0,
        humidity=50.0,
        gas=800.0, # High gas
        motion=1
    )

if __name__ == "__main__":
    run_simulation()
