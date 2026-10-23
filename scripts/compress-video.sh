#!/usr/bin/env bash
# ─── Compress agency-hero.mp4 for the web ────────────────────────────────────
# Requirements: ffmpeg >= 4.4
# Usage: bash scripts/compress-video.sh
# Place the original file at public/media/agency-hero.mp4 first.

set -euo pipefail

SRC="public/media/agency-hero.mp4"
OUT_DIR="public/media"

if [ ! -f "$SRC" ]; then
  echo "❌  Source file not found: $SRC"
  echo "    Copy the original video there first, then re-run this script."
  exit 1
fi

echo "🎬  Generating poster image…"
ffmpeg -y -ss 00:00:02 -i "$SRC" -vframes 1 -q:v 2 \
  "$OUT_DIR/agency-hero-poster.jpg"

echo "🎬  Converting poster to WebP…"
ffmpeg -y -i "$OUT_DIR/agency-hero-poster.jpg" \
  "$OUT_DIR/agency-hero-poster.webp"

echo "🎬  Encoding compressed MP4 (H.264, 720p, no audio)…"
ffmpeg -y -i "$SRC" \
  -vf "scale=-2:720" \
  -c:v libx264 -crf 26 -preset slow \
  -an \
  -movflags +faststart \
  "$OUT_DIR/agency-hero-720p.mp4"

echo "🎬  Encoding WebM (VP9, 720p, no audio)…"
ffmpeg -y -i "$SRC" \
  -vf "scale=-2:720" \
  -c:v libvpx-vp9 -crf 35 -b:v 0 \
  -an \
  "$OUT_DIR/agency-hero-720p.webm"

echo ""
echo "✅  Done! Files in $OUT_DIR:"
ls -lh "$OUT_DIR/"
