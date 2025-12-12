@echo off
REM Start Lost and Found Node server
cd "C:\Users\Test\.vscode\cli\Lost and found\server"
node server.js
start "" "http://localhost:5000"
