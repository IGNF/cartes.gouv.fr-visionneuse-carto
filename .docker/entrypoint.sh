#!/bin/sh
set -eu

: "${API_URL:?Missing required env var API_URL}"

if [ ! -w /tmp ]; then
  echo >&2 "ERROR: /tmp is not writable; mount an emptyDir/tmpfs at /tmp"
  exit 1
fi

escape_js_string() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

api_url_escaped="$(escape_js_string "$API_URL")"

cat > /tmp/env.js <<EOF
// Generated at container startup. Do not edit.
(() => {
  window.__DASHBOARD_VISIONNEUSE_ENV = {
    apiUrl: "${api_url_escaped}",
  };
  Object.freeze(window.__DASHBOARD_VISIONNEUSE_ENV);
  Object.defineProperty(window, "__DASHBOARD_VISIONNEUSE_ENV", {
    configurable: false,
    writable: false,
  });
})();
EOF

exec "$@"