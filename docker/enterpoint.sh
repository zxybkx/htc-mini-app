#!/bin/bash
set -e
find /usr/share/make-invoice/makeInvoice -name '*.html' | xargs sed -i "s BUILD_QR_CODE_BASE_URL $BUILD_QR_CODE_BASE_URL g"
find /usr/share/nginx/h5_html -name '*.js' | xargs sed -i "s /OS_ENV/ ${OS_ENV:-/} g"
find /usr/share/nginx/h5_html -name '*.html' | xargs sed -i "s /OS_ENV/ ${OS_ENV:-/} g"
find /usr/share/nginx/h5_html -name '*.js' | xargs sed -i "s OS_ENV $OS_ENV g"
find /usr/share/nginx/h5_html -name '*.html' | xargs sed -i "s OS_ENV $OS_ENV g"

exec "$@"


