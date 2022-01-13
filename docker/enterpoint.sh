#!/bin/bash
set -e
find /usr/share/make-invoice/makeInvoice -name '*.html' | xargs sed -i "s BUILD_QR_CODE_BASE_URL $BUILD_QR_CODE_BASE_URL g"

exec "$@"
