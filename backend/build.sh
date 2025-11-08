#!/bin/bash
# Render build script for Graceland Backend

echo "Installing dependencies..."
npm install

echo "Running database migrations..."
npm run migrate

echo "Build complete!"
