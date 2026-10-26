#!/bin/bash

REPO_DIR="/storage/emulated/0/Download/CS26"
JS_FILE="$REPO_DIR/sw.js" 
STATE_FILE="$REPO_DIR/.last_cache_version"

cd "$REPO_DIR" || exit

current_version=$(grep "CACHE_NAME" "$JS_FILE")

if [ -f "$STATE_FILE" ]; then
    last_version=$(cat "$STATE_FILE")
else
    last_version=""
fi

if [ "$current_version" != "$last_version" ]; then
    echo "Detected cache version change! Updating..."
    git pull
    echo "$current_version" > "$STATE_FILE"
fi
