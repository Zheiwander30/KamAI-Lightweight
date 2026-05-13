#!/bin/bash
# Run this once before `npm run dev` or before deploying.
# Downloads MediaPipe scripts to public/mediapipe/ so they are
# served locally — no CDN dependency, works offline, no bandwidth limits.

set -e
DIR="$(dirname "$0")/public/mediapipe"
mkdir -p "$DIR"

BASE="https://cdn.jsdelivr.net/npm/@mediapipe"

echo "Downloading MediaPipe scripts to public/mediapipe/ ..."

curl -fsSL "$BASE/hands/hands.js"                   -o "$DIR/hands.js"
curl -fsSL "$BASE/drawing_utils/drawing_utils.js"   -o "$DIR/drawing_utils.js"
curl -fsSL "$BASE/camera_utils/camera_utils.js"     -o "$DIR/camera_utils.js"

# Also download the WASM and tflite model files that hands.js needs at runtime
# locateFile() in App.jsx points to /mediapipe/ so these must live here too
curl -fsSL "$BASE/hands/hands_solution_packed_assets_loader.js" -o "$DIR/hands_solution_packed_assets_loader.js"
curl -fsSL "$BASE/hands/hands_solution_simd_wasm_bin.js"        -o "$DIR/hands_solution_simd_wasm_bin.js"
curl -fsSL "$BASE/hands/hands_solution_simd_wasm_bin.wasm"      -o "$DIR/hands_solution_simd_wasm_bin.wasm"
curl -fsSL "$BASE/hands/hands_solution_wasm_bin.js"             -o "$DIR/hands_solution_wasm_bin.js"
curl -fsSL "$BASE/hands/hands_solution_wasm_bin.wasm"           -o "$DIR/hands_solution_wasm_bin.wasm"
curl -fsSL "$BASE/hands/hand_landmark_full.tflite"              -o "$DIR/hand_landmark_full.tflite"
curl -fsSL "$BASE/hands/hand_landmark_lite.tflite"              -o "$DIR/hand_landmark_lite.tflite"
curl -fsSL "$BASE/hands/palm_detection_full.tflite"             -o "$DIR/palm_detection_full.tflite"
curl -fsSL "$BASE/hands/palm_detection_lite.tflite"             -o "$DIR/palm_detection_lite.tflite"

echo ""
echo "Done! Files in public/mediapipe/:"
ls -lh "$DIR"
