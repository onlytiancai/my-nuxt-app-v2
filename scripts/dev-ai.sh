-
#!/bin/bash

echo "Starting Nuxt 4..."
pnpm dev &

sleep 3

echo "Starting Chrome with remote debugging..."
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-mcp \
  http://localhost:3000 &

sleep 2

echo "Starting DevTools MCP..."
chrome-devtools-mcp --browser-url=http://localhost:9222