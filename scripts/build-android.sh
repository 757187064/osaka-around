#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${TRIP_KEYSTORE:?Set TRIP_KEYSTORE to your private signing key}"
: "${TRIP_KEYSTORE_PASSWORD:?Set TRIP_KEYSTORE_PASSWORD}"
node scripts/prepare-android.mjs
cd android
android_gradle="${TRIP_GRADLE:-./gradlew}"
if [[ -n "${TRIP_PRIVATE_QR:-}" ]]; then
  "$android_gradle" --no-daemon assembleStandardRelease assemblePersonalRelease
else
  "$android_gradle" --no-daemon assembleStandardRelease
fi
