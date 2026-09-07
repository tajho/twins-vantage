@echo off
title Twins Vantage Telemetry Collector Engine
cd /d "%~dp0"
echo ================================================================
echo   TWINS VANTAGE - INICIANDO MOTOR DE TELEMETRIA EN VIVO v4.0
echo   Nodo Maestro: ARCNTID002 ^| Subred: utilestwins.com
echo ================================================================
node twins_collector_core.js
pause
