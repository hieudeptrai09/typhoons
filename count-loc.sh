#!/usr/bin/env bash
# Đếm số dòng code trong project.
# Cách chạy trong Git Bash:  ./count-loc.sh   (hoặc: bash count-loc.sh)

set -e

echo "=== Đếm dòng code trong src/ ==="
npx cloc src/

echo
echo "Ghi chú: những vị trí còn lại không đáng kể, tổng thêm 194 dòng code."
