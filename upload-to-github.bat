@echo off
echo Uploading files to GitHub repository...

REM Initialize Git repository if not already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
)

REM Add remote repository if not already added
git remote -v | findstr /C:"origin" > nul
if errorlevel 1 (
    echo Adding remote repository...
    git remote add origin https://github.com/Tobbse007/Sch-tzenverein.git
)

REM Add all files to Git
echo Adding files to Git...
git add .

REM Commit changes
echo Committing changes...
git commit -m "Initial website setup"

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin master

echo Upload complete! Check your GitHub repository.
pause
