#!/bin/bash

# Function to check if the server is up
ping_server() {
  for i in {1..20}; do
    # Use curl to check if the server is responding on port 3000
    if curl -s --head http://localhost:3000 | head -n 1 | grep "HTTP/1.[1|2] [2|3].." > /dev/null; then
      echo "Server is up!"
      return 0
    fi
    echo "Waiting for server to start... Attempt $i"
    sleep 1
  done
  echo "Server failed to start."
  return 1
}

# Start the Next.js dev server in the background
npm run dev -- --turbo &

# Wait for the server to be ready
ping_server