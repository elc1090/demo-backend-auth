#!/bin/sh
set -eu
npx prisma db push
node server.js
