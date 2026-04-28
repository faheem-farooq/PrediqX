import pandas as pd
import io

try:
    content = b"a,b\n1,2"
    df = pd.read_csv(io.BytesIO(content), sep=None, engine='python')
    print("Success")
except Exception as e:
    print("Error:", e)
