@echo off
echo 🚀 Deploying Theme Fix to CapitaPrimellc Backend...
echo.

cd /d "c:\xampp\htdocs\CapitaPrimellc\backend"

echo 📋 Checking git status...
git status
echo.

echo 📝 Adding changes...
git add .
echo.

echo 💾 Committing theme fix...
git commit -m "Fix theme update 500 error - simplify batch operations and add logging"
echo.

echo 📤 Pushing to GitHub...
git push origin main
echo.

echo ✅ Theme fix deployed to GitHub!
echo 🔄 Render will auto-deploy or manually trigger deployment in Render dashboard
echo 🌐 Theme API will work after deployment
echo 🎨 Admin can then customize colors in ThemeView
echo.

pause