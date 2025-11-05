#!/bin/bash

# Backup app.module.ts
cp /home/user/omniads/backend/src/app.module.ts /home/user/omniads/backend/src/app.module.ts.backup

# Array of features
declare -a features=(
  "129:incremental-lift-measurement:IncrementalLiftMeasurementModule"
  "130:profit-analytics-dashboard:ProfitAnalyticsDashboardModule"
  "131:realtime-bid-optimizer:RealtimeBidOptimizerModule"
  "132:multi-platform-creative-generator:MultiPlatformCreativeGeneratorModule"
  "133:customer-journey-mapper:CustomerJourneyMapperModule"
  "134:predictive-ltv-segments:PredictiveLtvSegmentsModule"
  "135:social-commerce-hub:SocialCommerceHubModule"
  "136:influencer-campaign-manager:InfluencerCampaignManagerModule"
  "137:sms-marketing-integration:SmsMarketingIntegrationModule"
  "138:email-ad-sync-engine:EmailAdSyncEngineModule"
  "139:advanced-ab-test-framework:AdvancedAbTestFrameworkModule"
  "140:white-label-dashboard:WhiteLabelDashboardModule"
  "141:multi-currency-manager:MultiCurrencyManagerModule"
  "142:data-warehouse-connector:DataWarehouseConnectorModule"
  "143:server-side-tracking:ServerSideTrackingModule"
  "144:creative-performance-ai:CreativePerformanceAiModule"
  "145:budget-pacing-controller:BudgetPacingControllerModule"
  "146:audience-overlap-analyzer:AudienceOverlapAnalyzerModule"
  "147:cross-device-attribution:CrossDeviceAttributionModule"
)

APP_MODULE="/home/user/omniads/backend/src/app.module.ts"

# Add imports after the GenerativeAiCreativeStudioModule import
import_line="import { GenerativeAiCreativeStudioModule } from './generative-ai-creative-studio/generative-ai-creative-studio.module';"

# Build import statements
imports=""
for feature_data in "${features[@]}"; do
  IFS=':' read -r number folder module_name <<< "$feature_data"
  imports="${imports}\nimport { ${module_name} } from './${folder}/${folder}.module';"
done

# Add imports to the file
sed -i "/import { GenerativeAiCreativeStudioModule }/a\\${imports}" "$APP_MODULE"

# Build module list for imports array
modules=""
for feature_data in "${features[@]}"; do
  IFS=':' read -r number folder module_name <<< "$feature_data"
  modules="${modules}    ${module_name},\n"
done

# Add modules to the imports array
sed -i "/GenerativeAiCreativeStudioModule,/a\\${modules}" "$APP_MODULE"

echo "✅ Updated app.module.ts with all 19 new modules"
echo ""
echo "Modules added:"
for feature_data in "${features[@]}"; do
  IFS=':' read -r number folder module_name <<< "$feature_data"
  echo "  - Feature ${number}: ${module_name}"
done
