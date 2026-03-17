@echo off
echo 🚀 Deploying FINAL Theme Fix to CapitaPrimellc Backend...
echo.

cd /d "c:\xampp\htdocs\CapitaPrimellc\backend"

echo 📋 Checking git status...
git status
echo.

echo 📝 Adding final fixes...
git add .
echo.

echo 💾 Committing final theme fix...
git commit -m "FINAL FIX: Fix Content-Type header override and add database logging"
echo.

echo 📤 Pushing to GitHub...
git push origin main
echo.

echo ✅ FINAL theme fix deployed to GitHub!
echo 🔄 Render will auto-deploy
echo 🎨 Theme updates should now work perfectly
echo 📊 Check Render logs to see database operations
echo 🔍 Look for: 'Theme updated successfully in Firestore'
echo.

pause