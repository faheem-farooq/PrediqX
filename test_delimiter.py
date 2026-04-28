import pandas as pd
import io

content = b"header1\nvalue1\nvalue2\n"
try:
    df = pd.read_csv(io.BytesIO(content), sep=None, engine='python')
    print("Success:", df.columns.tolist())
except Exception as e:
    print("Error:", e)
