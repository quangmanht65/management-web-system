#! /bin/bash

cd "$(dirname "$0")"

cd ..

uvicorn --host=0.0.0.0 --app-dir=src --port=8000 --reload-dir=src main:app