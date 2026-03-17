@echo off
echo 🚀 Deploying CapitaPrimellc Backend...
echo.

cd /d "c:\xampp\htdocs\CapitaPrimellc\backend"

echo 📋 Checking git status...
git status
echo.

echo 📝 Adding changes...
git add .
echo.

echo 💾 Committing changes...
git commit -m "Add theme management API and routes"
echo.

echo 📤 Pushing to GitHub...
git push origin main
echo.

echo ✅ Backend changes pushed to GitHub!
echo 🔄 Render will auto-deploy or manually trigger deployment in Render dashboard
echo 🌐 Theme API will be available at: https://capitaprimellc.onrender.com/api/admin/theme
echo.

pause