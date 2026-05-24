@echo off
chcp 65001 >nul
echo ========================================
echo   Cloudflare Pages 部署脚本
echo ========================================
echo.

cd /d "%~dp0..\ai-note-h5"

echo [1/3] 构建项目...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败！
    pause
    exit /b 1
)
echo ✅ 构建完成

echo.
echo [2/3] 部署到 Cloudflare Pages...
npx wrangler pages deploy dist --project-name=lingzhi-note-h5 --branch=main
if errorlevel 1 (
    echo ❌ 部署失败！
    pause
    exit /b 1
)

echo.
echo [3/3] 清理缓存（可选）...
echo 如果需要清理 CDN 缓存，请访问：
echo https://dash.cloudflare.com -> Pages -> lingzhi-note-h5 -> Purge Cache

echo.
echo ========================================
echo   ✅ 部署成功！
echo ========================================
echo.
echo 🌐 访问地址：
echo   https://lingzhi-note-h5.pages.dev
echo.
echo ⚡ Worker 代理地址：
echo   https://lingzhi-note-fetch.821928907.workers.dev/fetch?url=xxx
echo.

pause
