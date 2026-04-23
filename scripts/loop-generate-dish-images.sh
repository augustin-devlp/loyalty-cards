#!/usr/bin/env bash
#
# Boucle jusqu'à ce que tous les menu_items aient une image.
# Appelle /api/admin/generate-dish-images par batch de 8.
#
# Usage :
#   ./scripts/loop-generate-dish-images.sh
#   (ou avec override : BASE_URL=https://staging.stampify.ch ./scripts/loop-generate-dish-images.sh)

set -euo pipefail

BASE_URL="${BASE_URL:-https://www.stampify.ch}"
BUSINESS_ID="${BUSINESS_ID:-59b10af2-5dbc-4ddd-a659-c49f44804bff}"
PIN="${PIN:-0808}"
BATCH_SIZE="${BATCH_SIZE:-8}"
MAX_ITER=30

echo "Loop generate-dish-images — BASE_URL=$BASE_URL batch=$BATCH_SIZE"

for i in $(seq 1 $MAX_ITER); do
  echo ""
  echo "─── Iteration $i/$MAX_ITER ───"
  RESP=$(curl -s -X POST "${BASE_URL}/api/admin/generate-dish-images" \
    -H "content-type: application/json" \
    --max-time 300 \
    -d "{\"business_id\":\"${BUSINESS_ID}\",\"pin\":\"${PIN}\",\"only_missing\":true,\"limit\":${BATCH_SIZE}}" \
    || echo '{"processed":0,"ok":0,"failed":0,"note":"curl_failed_or_timeout"}')

  PROCESSED=$(echo "$RESP" | grep -oE '"processed":[0-9]+' | grep -oE '[0-9]+' | head -1)
  OK=$(echo "$RESP" | grep -oE '"ok":[0-9]+' | grep -oE '[0-9]+' | head -1)
  FAILED=$(echo "$RESP" | grep -oE '"failed":[0-9]+' | grep -oE '[0-9]+' | head -1)
  PROCESSED=${PROCESSED:-0}
  OK=${OK:-0}
  FAILED=${FAILED:-0}

  echo "processed=$PROCESSED ok=$OK failed=$FAILED"

  if [ "$PROCESSED" -eq 0 ]; then
    echo "✅ Plus rien à traiter — DONE."
    break
  fi

  if [ "$OK" -eq 0 ] && [ "$FAILED" -gt 0 ]; then
    # Tout en échec → probable quota 429, attend 30s avant de retry
    echo "⚠️ 0 succès, probable quota 429 — pause 30s..."
    sleep 30
  fi
done

echo ""
echo "Fin du script."
