import sys
sys.path.insert(0, '/Users/faheem.ff/capstone/backend')

from app.services.data_processor import data_processor

try:
    eda = data_processor.get_eda_summary('/Users/faheem.ff/capstone/backend/uploads/f4f2179d-918c-432d-ab90-1f955d6016cc.csv')
    print("EDA generated successfully!")
    print(f"Overview keys: {list(eda['dataset_overview'].keys())}")
    print(f"Numerical Analysis count: {len(eda['numerical_analysis'])}")
    if len(eda['numerical_analysis']) > 0:
        print(f"First numerical feature keys: {list(eda['numerical_analysis'][0].keys())}")
except Exception as e:
    print(f"Error: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
