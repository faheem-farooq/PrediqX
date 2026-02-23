from app.services.data_processor import data_processor
import json
import pandas as pd
import io

# Create a sample CSV with clear headers and mixed types
csv_content = """company, profit, revenue, employees, founded_year, sector
A Corp, 100000, 500000, 50, 2000, Technology
B Inc, 200000, 800000, 120, 2010, Finance
C Ltd, 50000, -10000, 10, 2022, Technology
D LLC, 150000, 600000, 80, 2015, Retail
"""

file_path = "test_eda_fix.csv"
with open(file_path, "w") as f:
    f.write(csv_content)

try:
    print("Testing EDA with new parsing logic...")
    stats = data_processor.get_eda_summary(file_path)
    
    print("\n--- Dataset Overview ---")
    print(json.dumps(stats['dataset_overview'], indent=2))
    
    print("\n--- Numerical Analysis (Should have 4 items) ---")
    print(f"Count: {len(stats['numerical_analysis'])}")
    for item in stats['numerical_analysis']:
        print(f"- {item['feature']}: mean={item['mean']}")

    print("\n--- Categorical Analysis (Should have 2 items) ---")
    print(f"Count: {len(stats['categorical_analysis'])}")
    for item in stats['categorical_analysis']:
        print(f"- {item['feature']}: unique={item['unique_count']}")
        
    print("\n--- Target Distribution ---")
    print(stats.get('target_distribution'))

except Exception as e:
    print(f"FAILED: {e}")
