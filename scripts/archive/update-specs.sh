#!/bin/bash

specs_dir="/home/user/omniads/specs"

for i in {112..127}; do
  # Find directory matching pattern
  dir=$(find "$specs_dir" -maxdepth 1 -type d -name "${i}-*" | head -1)

  if [ -n "$dir" ]; then
    spec_file="$dir/spec.md"
    if [ -f "$spec_file" ]; then
      # Update Status line
      sed -i 's/\*\*Status\*\*: Draft/**Status**: Implemented\n**Implementation Date**: 2025-11-05/' "$spec_file"
      echo "Updated spec for feature $i"
    fi
  fi
done

echo "All spec files updated!"
