@echo off
setlocal
set "SITE_ROOT=%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SITE_ROOT%tools\site-toggle.ps1" %*
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo.
  echo Site launcher failed. Review the message above.
  pause
)

exit /b %EXIT_CODE%
