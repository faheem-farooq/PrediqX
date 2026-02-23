from app.services.data_processor import data_processor
import json

file_path = "/Users/faheem.ff/capstone/test_data_v2.csv"
try:
    print(f"Testing EDA on {file_path}...")
    eda_stats = data_processor.get_eda_summary(file_path)
    print("EDA Success!")
    print(json.dumps(eda_stats, indent=2, default=str))
except Exception as e:
    print(f"EDA Failed: {e}")
