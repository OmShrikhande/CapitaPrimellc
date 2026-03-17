@echo off
echo 🚀 Deploying Debug Version to CapitaPrimellc Backend...
echo.

cd /d "c:\xampp\htdocs\CapitaPrimellc\backend"

echo 📋 Checking git status...
git status
echo.

echo 📝 Adding debug changes...
git add .
echo.

echo 💾 Committing debug version...
git commit -m "Add debug logging to theme controller to fix req.body undefined error"
echo.

echo 📤 Pushing to GitHub...
git push origin main
echo.

echo ✅ Debug version deployed to GitHub!
echo 🔄 Render will auto-deploy or manually trigger deployment in Render dashboard
echo 🐛 Check Render logs for detailed debugging info
echo 🎯 This will show us exactly what's happening with req.body
echo.

pause