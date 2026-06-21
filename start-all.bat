@echo off
title GateSend - Start All
color 0A

echo ============================================
echo   GateSend - Starting All Services
echo ============================================
echo.

:: 1. Start wa-server via PM2
echo [1/4] Starting WA Server (PM2)...
pm2 delete wa-server 2>nul
pm2 start ecosystem.config.js
echo.

:: 2. Start ngrok di window baru
echo [2/4] Starting ngrok...
start "ngrok" cmd /k "wa-server\ngrok.exe http 3001"
echo Tunggu ngrok siap...
timeout /t 5 /nobreak >nul

:: 3. Auto-update .env.local - tunggu sampai berhasil
echo [3/4] Update WA_SERVER_URL di .env.local...
:retry_ngrok
node wa-server\update-env.js
if %errorlevel% neq 0 (
  echo Ngrok belum siap, coba lagi dalam 3 detik...
  timeout /t 3 /nobreak >nul
  goto retry_ngrok
)
echo.

:: 4. Start Next.js SETELAH .env.local berhasil diupdate
echo [4/4] Starting Next.js...
start "Next.js" cmd /k "npm run dev"
echo.

echo ============================================
echo   Semua service berjalan!
echo   - WA Server  : http://localhost:3001
echo   - QR Scan    : http://localhost:3001/qr
echo   - App        : http://localhost:3000
echo ============================================
echo.
echo Tekan tombol apapun untuk keluar dari launcher ini...
pause >nul
