#!/bin/bash
set -e

echo "Installing all dependencies including devDependencies..."
cd /var/app/staging
npm install

echo "Running npm build..."
npm run build
