#!/bin/bash

cd server
nodemon index.js &

cd ../client
npm run dev
