import json

with open("vercel.json", "r") as f:
    config = json.load(f)

for rw in config.get("rewrites", []):
    print("Source:", rw.get("source"), "Dest:", rw.get("destination"))
