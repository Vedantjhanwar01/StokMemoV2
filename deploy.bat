@echo off
echo ========================================
echo StockMemo - Quick Deploy to Vercel
echo ========================================
echo.

echo Step 1: Checking if Vercel CLI is installed...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
) else (
    echo Vercel CLI already installed.
)

echo.
echo Step 2: Deploying to Vercel...
echo.
vercel

echo.
echo ========================================
echo IMPORTANT: Set API Key
echo ========================================
echo.
echo Run this command to add your Gemini API key:
echo   vercel env add GEMINI_API_KEY
echo.
echo Then redeploy:
echo   vercel --prod
echo.
echo Get your API key: https://aistudio.google.com/apikey
echo ========================================
pause
