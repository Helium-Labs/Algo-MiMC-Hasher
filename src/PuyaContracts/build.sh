#!/bin/bash

# Get the directory where the script is located
script_dir="$(cd "$(dirname "$0")" && pwd)"

# Iterate through each child directory of the script's directory
for dir in "$script_dir"/*/; do
    # Check if the directory exists
    if [ -d "$dir" ]; then
        # Check if contract.py exists in the current directory
        if [ -f "$dir/contract.py" ]; then
            # Run the algokit command
            algokit compile py "$dir/contract.py" -g 2 -O 2 --out-dir "$script_dir/build"
            
            # Get the base name of the directory
            base_name=$(basename "$dir")
            
            # Create the TypeScript file path
            ts_file="$script_dir/build/$base_name.ts"
            client_ts_file="$script_dir/build/$base_name.client.ts"

            # Get the compiled file path
            compiled_file="$script_dir/build/$base_name.teal"
            approval_compiled_file="$script_dir/build/$base_name.approval.teal"
            arc32_compiled_file="$script_dir/build/$base_name.arc32.json"

            # Check if the compiled file exists
            if [ -f "$compiled_file" ]; then
                # Read the contents of the compiled file
                file_contents=$(cat "$compiled_file")
                
                # Create the TypeScript file with the exported template string
                echo "export default \`$file_contents\`;" > "$ts_file"

                echo "TypeScript file created: $ts_file"
            elif [ -f "$approval_compiled_file" ]; then
                algokit generate client "$arc32_compiled_file" --output $client_ts_file
            else
                echo "Compiled file not found: $compiled_file. Skipping TypeScript file creation."
            fi
        else
            echo "contract.py not found in $dir. Skipping."
        fi
    fi
done
