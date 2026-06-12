#!/usr/bin/env bash
set -e

echo "pulling the code from git"
git pull

echo "installing dependencies"
npm install

echo "building the project"
npm run build

echo "deploying the project (restart pm2)"
if command -v pm2 >/dev/null 2>&1; then
  pm2 restart all || true
else
  echo "pm2 not found — skipping pm2 restart"
fi

echo "deployment complete"
