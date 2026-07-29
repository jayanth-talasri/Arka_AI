import os
import pandas as pd

# Folder containing all NASA CSV files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

RAW_FOLDER = os.path.join(BASE_DIR, "..", "data", "raw")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "..", "data", "merged")

os.makedirs(OUTPUT_FOLDER, exist_ok=True)



merged_data = []

for file in os.listdir(RAW_FOLDER):

    if file.endswith(".csv"):

        filepath = os.path.join(RAW_FOLDER, file)

        city = os.path.splitext(file)[0]

        print(f"Reading {city}...")

        df = pd.read_csv(filepath)

        # Add city column
        df["City"] = city

        merged_data.append(df)

# Merge all files
final_df = pd.concat(merged_data, ignore_index=True)

# Save
output_file = os.path.join(OUTPUT_FOLDER, "solar_dataset.csv")

final_df.to_csv(output_file, index=False)

print("\nDataset merged successfully.")
print(f"Rows: {len(final_df)}")
print(f"Columns: {len(final_df.columns)}")
print(f"Saved at: {output_file}")