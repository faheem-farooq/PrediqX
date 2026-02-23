import requests
import json
import os

BASE_URL = "http://localhost:8000/api/v1"
FILE_PATH = "/Users/faheem.ff/capstone/backend/test_eda_fix.csv"

def test_flow():
    print(f"1. Uploading {FILE_PATH}...")
    with open(FILE_PATH, 'rb') as f:
        files = {'file': f}
        response = requests.post(f"{BASE_URL}/data/upload", files=files)
    
    if response.status_code != 200:
        print(f"Upload Failed: {response.text}")
        return

    data = response.json()
    file_id = data['file_id']
    print(f"Upload Success! File ID: {file_id}")

    print(f"2. Fetching EDA for {file_id}...")
    eda_response = requests.get(f"{BASE_URL}/data/eda/{file_id}")

    if eda_response.status_code != 200:
        print(f"EDA Failed: {eda_response.text}")
        return

    eda_stats = eda_response.json()
    print("EDA Success! Overview:")
    print(json.dumps(eda_stats['dataset_overview'], indent=2))
    print(f"Numerical Columns: {[f['feature'] for f in eda_stats['numerical_analysis']]}")
    print(f"Categorical Columns: {[f['feature'] for f in eda_stats['categorical_analysis']]}")

if __name__ == "__main__":
    test_flow()
