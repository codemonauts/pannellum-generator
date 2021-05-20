#! /usr/bin/env bash

echo "Generating index.html"
python3 generate_html.py

echo "Starting webserver on port 8000"
python3 -m http.server --bind 0.0.0.0 --directory out/ 8000
