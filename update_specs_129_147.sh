#!/bin/bash

# Array of features
declare -a features=(129 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144 145 146 147)

SPECS_DIR="/home/user/omniads/specs"

for number in "${features[@]}"; do
  # Find the spec directory
  spec_dir=$(find "$SPECS_DIR" -type d -name "${number}-*" | head -1)

  if [ -z "$spec_dir" ]; then
    echo "⚠️  Spec directory not found for feature ${number}"
    continue
  fi

  spec_file="${spec_dir}/spec.md"

  if [ ! -f "$spec_file" ]; then
    echo "⚠️  Spec file not found: ${spec_file}"
    continue
  fi

  # Update the spec status
  sed -i 's/^**Status**: Draft/**Status**: Implemented/' "$spec_file"
  sed -i '/^**Status**: Implemented/a **Implementation Date**: 2025-11-05' "$spec_file"

  echo "✅ Updated spec for feature ${number}"
done

echo ""
echo "🎉 All specs updated successfully!"
