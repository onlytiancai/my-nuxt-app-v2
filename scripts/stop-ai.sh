#!/bin/bash

echo "Stopping Nuxt..."
pkill -f "nuxt"

echo "Stopping Chrome MCP instance..."
pkill -f "chrome-mcp"

echo "Stopping DevTools MCP..."
pkill -f "chrome-devtools-mcp"

echo "All stopped."