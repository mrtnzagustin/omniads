#!/bin/bash

# Update status for specs 068-087

for num in {068..087}; do
  spec_dirs=(specs/${num}-*)

  for spec_dir in "${spec_dirs[@]}"; do
    if [ -d "$spec_dir" ]; then
      spec_file="$spec_dir/spec.md"

      if [ -f "$spec_file" ]; then
        # Check if status is Draft
        if grep -q "^\*\*Status\*\*: Draft" "$spec_file"; then
          # Update to Implemented
          sed -i "s/^\*\*Status\*\*: Draft/\*\*Status\*\*: Implemented\n\*\*Implementation Date\*\*: 2025-11-05/" "$spec_file"
          echo "✓ Updated $(basename $spec_dir)"
        fi
      fi
    fi
  done
done

echo ""
echo "All specs 068-087 updated to Implemented status!"
