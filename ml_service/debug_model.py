from model import AnomalyDetector
import os

print(f"Current working directory: {os.getcwd()}")
if os.path.exists('sensor_data.csv'):
    print(f"sensor_data.csv exists. Size: {os.path.getsize('sensor_data.csv')} bytes")
    try:
        df = pd.read_csv('sensor_data.csv')
        print(f"DataFrame Length: {len(df)}")
        print(f"DataFrame Head:\n{df.head()}")
    except Exception as e:
        print(f"Error reading CSV: {e}")
else:
    print("sensor_data.csv does NOT exist.")

detector = AnomalyDetector()
success = detector.train()
print(f"Training success: {success}")

anomaly_data = {
    "temp": 25.0,
    "humidity": 50.0,
    "gas": 9000.0,
    "motion": 1
}
pred = detector.predict(anomaly_data)
print(f"Prediction for anomaly: {pred}")

normal_data = {
    "temp": 22.0,
    "humidity": 50.0,
    "gas": 150.0,
    "motion": 0
}
pred_norm = detector.predict(normal_data)
print(f"Prediction for normal: {pred_norm}")
