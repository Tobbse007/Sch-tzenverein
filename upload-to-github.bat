@echo off
REM Optimierte GitHub-Upload-Datei mit besserer Fehlerbehandlung und detaillierten Meldungen

echo ==================================
echo = GitHub Repository Upload Tool =
echo ==================================
echo.

REM Überprüfen, ob Git installiert ist
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo FEHLER: Git ist nicht installiert oder nicht im PATH.
    echo Bitte installieren Sie Git von https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)

REM Datum und Zeit für Commit-Message
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "SS=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%SS%"

REM Abfrage, ob ein benutzerdefininierter Commit-Kommentar verwendet werden soll
set /p custom_commit="Benutzerdefinierte Commit-Message eingeben oder Enter für auto-generierte Message: "

if "%custom_commit%"=="" (
    set "commit_message=Website Update %timestamp%"
) else (
    set "commit_message=%custom_commit%"
)

REM Initialize Git repository if not already initialized
if not exist .git (
    echo Initialisiere Git-Repository...
    git init
    if %ERRORLEVEL% NEQ 0 (
        echo FEHLER: Repository-Initialisierung fehlgeschlagen.
        pause
        exit /b 1
    )
    echo Git-Repository erfolgreich initialisiert.
    echo.
)

REM Check if remote is properly configured
git remote -v | findstr /C:"origin" > nul
if %ERRORLEVEL% NEQ 0 (
    echo Remote "origin" nicht gefunden. Füge Remote-Repository hinzu...
    
    REM Option to enter custom repo URL
    set /p use_default="Standard-Repository verwenden (https://github.com/Tobbse007/Sch-tzenverein.git)? [J/n]: "
    
    if /i "%use_default%"=="n" (
        set /p repo_url="Bitte geben Sie die URL des Remote-Repository ein: "
        git remote add origin %repo_url%
    ) else (
        git remote add origin https://github.com/Tobbse007/Sch-tzenverein.git
    )
    
    if %ERRORLEVEL% NEQ 0 (
        echo FEHLER: Remote Repository konnte nicht hinzugefügt werden.
        pause
        exit /b 1
    )
    echo Remote "origin" erfolgreich hinzugefügt.
    echo.
)

REM Check for changes
git status --porcelain > nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNUNG: Git-Status konnte nicht abgerufen werden.
    echo Fahre trotzdem fort...
    echo.
)

REM Add all changes to staging
echo Füge Änderungen zum Staging-Bereich hinzu...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo FEHLER: Änderungen konnten nicht zum Staging-Bereich hinzugefügt werden.
    pause
    exit /b 1
)
echo Änderungen erfolgreich hinzugefügt.
echo.

REM Check if there are changes to commit
git diff --staged --quiet
if %ERRORLEVEL% EQU 0 (
    echo Keine Änderungen zum Commit gefunden.
    echo.
) else (
    REM Commit changes
    echo Erstelle Commit mit Message: "%commit_message%"...
    git commit -m "%commit_message%"
    if %ERRORLEVEL% NEQ 0 (
        echo FEHLER: Commit konnte nicht erstellt werden.
        pause
        exit /b 1
    )
    echo Commit erfolgreich erstellt.
    echo.
)

REM Determine the default branch
for /f "tokens=*" %%a in ('git symbolic-ref --short HEAD 2^>nul') do set "current_branch=%%a"
if "%current_branch%"=="" set "current_branch=master"

REM Push to GitHub
echo Pushe zu GitHub (Branch: %current_branch%)...
git push -u origin %current_branch%
if %ERRORLEVEL% NEQ 0 (
    echo WARNUNG: Push zu GitHub fehlgeschlagen. Möglicherweise ist eine Authentifizierung erforderlich.
    echo Bitte geben Sie Ihre GitHub-Anmeldedaten ein, wenn Sie dazu aufgefordert werden.
    echo.
    
    REM Try push again and allow credential prompt
    git push -u origin %current_branch%
    if %ERRORLEVEL% NEQ 0 (
        echo FEHLER: Push zu GitHub fehlgeschlagen.
        echo Mögliche Ursachen:
        echo - Keine Internetverbindung
        echo - Falsche Zugangsdaten
        echo - Repository existiert nicht auf GitHub
        echo - Keine Push-Berechtigung
        echo.
        pause
        exit /b 1
    )
)

echo ==================================
echo Upload erfolgreich abgeschlossen!
echo Überprüfen Sie Ihr Repository unter:
echo https://github.com/Tobbse007/Sch-tzenverein
echo ==================================
echo.

pause
