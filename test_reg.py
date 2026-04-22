import requests
import json

url = "http://localhost:4000/auth/register"
data = {
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "buyer"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
