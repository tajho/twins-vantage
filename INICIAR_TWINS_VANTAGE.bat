@echo off
title TWINS VANTAGE - Centro de Hardware y Diagnostico TI
color 0B
cls
echo =====================================================================
echo    TWINS VANTAGE -- CENTRO DE HARDWARE, DIAGNOSTICO Y FLOTA TI
echo       Importadora Arcangel / Utiles Twins - utilestwins.com
echo =====================================================================
echo.
echo [1/2] Verificando entorno Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado o no se encuentra en el PATH.
    pause
    exit /b 1
)

echo [2/2] Iniciando servidor de monitoreo y telemetria...
echo       Acceso disponible en: http://localhost:3000
echo.
echo Abriendo navegador en Twins Vantage...
start "" "http://localhost:3000"

node server.js
pause
