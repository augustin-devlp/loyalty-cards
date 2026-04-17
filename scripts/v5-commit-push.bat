@echo off
REM ============================================================
REM   v5 — commit + push des itérations HeroCanvas/FloatingHands
REM   Lance-moi depuis C:\Users\augus\loyalty-cards
REM ============================================================

setlocal

echo.
echo [1/6] Nettoyage des locks git laissés par le sandbox Linux...
if exist ".git\index.lock" del /F /Q ".git\index.lock"
if exist ".git\HEAD.lock" del /F /Q ".git\HEAD.lock"
for /f "tokens=*" %%F in ('dir /b /a-d .git\index.lock* 2^>nul') do del /F /Q ".git\%%F"
for /f "tokens=*" %%F in ('dir /b /a-d .git\HEAD.lock* 2^>nul') do del /F /Q ".git\%%F"

echo.
echo [2/6] Nettoyage des tmp objects orphelins...
for /f "tokens=*" %%D in ('dir /b /ad .git\objects 2^>nul') do (
    for /f "tokens=*" %%F in ('dir /b /a-d .git\objects\%%D\tmp_obj_* 2^>nul') do (
        del /F /Q ".git\objects\%%D\%%F" 2>nul
    )
)

echo.
echo [3/6] Stage des fichiers v5 + fix layout/page + scripts...
git add src/app/v5/ ^
        src/components/v5/HeroCanvas.tsx ^
        src/components/v5/HeroSection.tsx ^
        src/components/v5/FloatingHands.tsx ^
        src/app/layout.tsx ^
        src/app/page.tsx ^
        package.json ^
        package-lock.json ^
        scripts/v5-commit-push.bat

if errorlevel 1 (
    echo     Echec du git add. Verifie la sortie ci-dessus.
    exit /b 1
)

echo.
echo [4/6] Resume de ce qui sera commite :
git diff --cached --stat

echo.
echo [5/6] Commit...
git commit -m "iter(v5): 8 tours animations hero — beams + orbs + mains + fond" ^
           -m "Tour 1: beams plus lents (0.002-0.0024), ondulation sinusoidale subtile, halo 22px, core 1.25 tente rgba(124,224,186)." ^
           -m "Tour 2: drift multi-harmonique des orbs (2 sinusoides superposees)." ^
           -m "Tour 3: distribution asymetrique des orbs (0.38, 0.82, 0.14, 0.72, 0.50)." ^
           -m "Tour 5: mains — filter simplifie sans hue-rotate, amplitude Y [-7,-15,-18,-13,-5], duree 5.2/5.8s, ease cubic [0.4,0,0.4,1]." ^
           -m "Tour 6: dérive verticale subtile des beams (6px, 22s)." ^
           -m "Tour 7: fond hero en radial-gradient #FFFFFF → #EEF3EF." ^
           -m "Tour 8: respiration d'opacité individuelle par orb (±15%%, ~35s)." ^
           -m "Restauration: src/app/layout.tsx + src/app/page.tsx tronques par stash errone."

if errorlevel 1 (
    echo     Echec du commit. Si c'est "nothing to commit", c'est bon.
)

echo.
echo [6/6] Push vers origin/master...
git push origin master

echo.
echo =========== TERMINE ===========
echo Surveille Vercel : le build devrait demarrer automatiquement.
echo Quand READY, ouvre https://stampify.ch/v5 et compare avec handhold.io.
echo.

endlocal
