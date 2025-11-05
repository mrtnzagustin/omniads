#!/bin/bash

features=(
  "dynamic-lookalike-generator"
  "smart-campaign-cloner"
  "predictive-churn-retargeting"
  "ai-seasonality-planner"
  "creative-element-mixer"
  "realtime-sentiment-optimizer"
  "multi-objective-balancer"
  "intelligent-frequency-capper"
  "platform-performance-allocator"
  "ai-compliance-guardian"
  "predictive-lifetime-budget"
  "cross-campaign-synthesizer"
  "dynamic-offer-optimizer"
  "ai-test-designer"
  "smart-campaign-pauser"
)

cd /home/user/omniads/backend

echo "Running tests for all features (113-127)..."
echo "============================================"

all_passed=true

for feature in "${features[@]}"; do
  echo ""
  echo "Testing $feature..."
  if npm test -- "$feature" 2>&1 | grep -q "Tests.*passed"; then
    echo "✓ $feature - PASSED"
  else
    echo "✗ $feature - FAILED"
    all_passed=false
  fi
done

echo ""
echo "============================================"
if [ "$all_passed" = true ]; then
  echo "All tests PASSED!"
else
  echo "Some tests FAILED. Check individual test output above."
fi
