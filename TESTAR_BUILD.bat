@echo off
setlocal
cd /d "%~dp0"
title Teste de build - Virtum SVS Viewer v0.5.10

echo Limpando build anterior...
if exist dist rmdir /s /q dist

echo Testando Heavy Slide Engine + Smart Cache + Predictive Navigation + Instant Open + Mobile Viewer 2.0 + Benchmark & Diagnostics + Mobile Heavy Open Rescue...
call npm run test:runtime
if errorlevel 1 (
  echo.
  echo [ERRO] Os testes de runtime falharam.
  pause
  exit /b 1
)

echo Gerando build de producao...
call npm run build:vercel
if errorlevel 1 (
  echo.
  echo [ERRO] O build falhou.
  pause
  exit /b 1
)

echo.
echo Build concluido. Iniciando preview...
start "" cmd /c "timeout /t 3 /nobreak ^>nul ^& start http://localhost:4173"
call npm run preview
endlocal
