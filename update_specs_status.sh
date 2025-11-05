#!/bin/bash

cd /home/user/omniads/specs

for i in $(seq 48 67); do
  dir_pattern="${i}-*"
  for spec_dir in $dir_pattern; do
    if [ -d "$spec_dir" ]; then
      spec_file="$spec_dir/spec.md"
      if [ -f "$spec_file" ]; then
        sed -i 's/^**Status**: Draft$/**Status**: Implemented/' "$spec_file"
        sed -i '/^**Status**: Implemented$/a **Implementation Date**: 2025-11-05' "$spec_file"
        echo "Updated $spec_file"
      fi
    fi
  done
done

echo "All specs updated!"
