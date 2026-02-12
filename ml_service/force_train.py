import requests

def force_train():
    url = "http://localhost:5000/train"
    try:
        response = requests.post(url)
        print(f"Train Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    force_train()
