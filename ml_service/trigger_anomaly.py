import requests

def trigger_anomaly():
    url = "http://localhost:5000/data"
    # Anomaly data (High Gas)
    data = {
        "temp": 25.0,
        "humidity": 50.0,
        "gas": 9000.0, # EXTREEEME GAS
        "motion": 1
    }
    try:
        response = requests.post(url, json=data)
        print(f"Sent Anomaly Data. Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    trigger_anomaly()
