import os
import pandas as pd

file_path = 'sensor_data.csv'
columns = ['temp', 'humidity', 'gas', 'motion']

if os.path.exists(file_path):
    try:
        # Read with header=None to see what's there
        df = pd.read_csv(file_path, header=None)
        
        # Check if first row is header
        first_row = df.iloc[0].tolist()
        if first_row == columns:
            print("Header already exists.")
            # Remove empty lines if any (pandas handles this but writing back cleans it)
            df = pd.read_csv(file_path)
        else:
            print("Header missing. Adding header.")
            # If the first row is NOT data (e.g. empty or weird), handle it?
            # Assuming it is data, we reload with names=columns
            df = pd.read_csv(file_path, header=None, names=columns)
        
        # clean empty rows?
        df.dropna(inplace=True)
        
        # Write back
        df.to_csv(file_path, index=False)
        print(f"Fixed CSV. Rows: {len(df)}")
        print(df.head())
        
    except Exception as e:
        print(f"Error fixing CSV: {e}")
        # If read fails (e.g. empty file), verify
        if os.path.getsize(file_path) == 0:
             pd.DataFrame(columns=columns).to_csv(file_path, index=False)
             print("Created new file with header.")

else:
    print("File not found. Creating new.")
    pd.DataFrame(columns=columns).to_csv(file_path, index=False)
