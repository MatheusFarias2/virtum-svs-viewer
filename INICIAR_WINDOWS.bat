@echo off
setlocal
cd /d "%~dp0"
title Virtum SVS Viewer v0.5.2.2

echo.
echo ============================================
echo       Virtum SVS Viewer v0.5.2.2
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao foi encontrado.
  echo Instale o Node.js 24 LTS e tente novamente.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [1/2] Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERRO] O npm install falhou.
    pause
    exit /b 1
  )
) else (
  echo [1/2] Dependencias ja instaladas.
)

echo [2/2] Iniciando o visualizador...
start "" cmd /c "timeout /t 3 /nobreak ^>nul ^& start http://localhost:5173"
call npm run dev

endlocal
