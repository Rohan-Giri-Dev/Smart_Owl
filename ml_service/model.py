import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest
import os

class MotionTracker:
    def __init__(self, window_size=20, threshold=10):
        self.window_size = window_size
        self.threshold = threshold
        self.history = []

    def update(self, motion_value):
        self.history.append(int(motion_value))
        if len(self.history) > self.window_size:
            self.history.pop(0)

    def is_excessive(self):
        return sum(self.history) >= self.threshold

class AnomalyDetector:
    def __init__(self, data_file='sensor_data.csv', model_file='model.pkl'):
        self.data_file = data_file
        self.model_file = model_file
        self.model = None
        self.motion_tracker = MotionTracker()
        self.load_model()
        
    def load_model(self):
        if os.path.exists(self.model_file):
            try:
                self.model = joblib.load(self.model_file)
                print("Model loaded successfully.")
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None
        else:
            print("No model found. Please train first.")
            self.model = None

    def train(self):
        if not os.path.exists(self.data_file):
            print("No data file found for training.")
            return False
        
        try:
            df = pd.read_csv(self.data_file)
            if len(df) < 50: # Require some minimum data
                print("Not enough data to train (need at least 50 points).")
                return False
            
            # Features to use for training
            features = ['temp', 'humidity', 'gas', 'motion']
            X = df[features]
            
            # Initialize and fit IsolationForest
            self.model = IsolationForest(contamination=0.01) # Approx 1% anomalies
            self.model.fit(X)
            
            joblib.dump(self.model, self.model_file)
            print("Model trained and saved.")
            return True
        except Exception as e:
            print(f"Error during training: {e}")
            return False

    def predict(self, data_point):
        # data_point should be a dict: {'temp': 25.0, 'humidity': 50.0, 'gas': 100, 'motion': 0}
        if self.model is None:
            return 1, "No Model" # Assume normal if no model (1 is normal, -1 is anomaly for IsolationForest)
        
        try:
            df = pd.DataFrame([data_point])
            features = ['temp', 'humidity', 'gas', 'motion']
            # Ensure correct column order
            X = df[features]
            prediction = self.model.predict(X)[0]
            
            # Check for excessive motion
            self.motion_tracker.update(data_point.get('motion', 0))
            if self.motion_tracker.is_excessive():
                return -1, "High Motion Detected! Check the Camera."
            
            if prediction == -1:
                # Identify the cause of the anomaly
                # Simple heuristic: which feature is furthest from "normal"?
                # For now, we'll just check common thresholds since IsolationForest doesn't give feature importance easily per sample without more work
                # Or we can just check if values are out of a safe range.
                if data_point.get('gas', 0) > 300: # Example threshold
                     return -1, "High Gas Levels Detected! Check Air Quality."
                if data_point.get('temp', 0) > 35:
                     return -1, "High Temperature Detected!"
                if data_point.get('humidity', 0) > 80:
                     return -1, "High Humidity Detected!"
                
                return -1, "Unusual Environment Patterns Detected."
            
            return 1, "Normal"
        except Exception as e:
            print(f"Error predicting: {e}")
            return 1, "Error" # Default to normal on error

    def log_data(self, data_point):
        # Append data to CSV
        df = pd.DataFrame([data_point])
        # Ensure column order matches features to avoid mismatch in CSV
        features = ['temp', 'humidity', 'gas', 'motion']
        # Add missing columns with 0 if needed, though they should be present
        for col in features:
            if col not in df.columns:
                df[col] = 0
        df = df[features]
        # Check if file exists to write header
        # Check if file exists and is empty
        write_header = not os.path.exists(self.data_file) or os.stat(self.data_file).st_size == 0
        df.to_csv(self.data_file, mode='a', header=write_header, index=False)
