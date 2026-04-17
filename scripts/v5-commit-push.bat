@echo off
REM ============================================================
REM   v5 — ITER 90 : iPhone mockup + hero blanc minimaliste
REM   Pivot total : plus d'orbs, plus de beams, juste un phone qui flotte.
REM   Inspiration : topanga.io, searchable.com, karumi.ai
REM   Lance depuis C:\Users\augus\loyalty-cards
REM ============================================================

setlocal

echo.
echo [1/6] Nettoyage des locks git eventuels...
if exist ".git\index.lock" del /F /Q ".git\index.lock"
if exist ".git\HEAD.lock" del /F /Q ".git\HEAD.lock"
for /f "tokens=*" %%F in ('dir /b /a-d .git\index.lock* 2^>nul') do del /F /Q ".git\%%F"
for /f "tokens=*" %%F in ('dir /b /a-d .git\HEAD.lock* 2^>nul') do del /F /Q ".git\%%F"

echo.
echo [2/6] Stage des fichiers v5...
git add src/components/v5/HeroSection.tsx ^
        src/components/v5/PhoneMockup.tsx ^
        src/app/v5/PROGRESS.md ^
        scripts/v5-commit-push.bat

if errorlevel 1 (
    echo     Echec du git add. Verifie la sortie ci-dessus.
    exit /b 1
)

echo.
echo [3/6] Resume de ce qui sera commite :
git diff --cached --stat

echo.
echo [4/6] Build local pour validation...
call npm run build
if errorlevel 1 (
    echo     Build echoue ^!
    echo     Corrige l'erreur avant de pusher.
    exit /b 1
)

echo.
echo [5/6] Commit ITER 90 (phone mockup)...
git commit -m "ITER 90 — PIVOT mockup iPhone : hero blanc minimaliste, plus d'orbs/beams" ^
           -m "Inspiration : topanga.io, searchable.com, karumi.ai." ^
           -m "Nouveau composant src/components/v5/PhoneMockup.tsx : chassis titanium degrade (145deg, 4 stops), ecran noir avec notch Dynamic Island, carte fidelite Stampify a l'ecran (header Cafe Lumiere, grille 5x2 tampons 7 rempli/3 vide, barre progression teal, CTA Prochain cafe). Float 6.4s easeInOut + rotate subtil, ombre radiale animee separee (scale 0.82, blur 10->16px). pop-in staggered des tampons remplis (cubic-bezier 0.34,1.56,0.64,1)." ^
           -m "HeroSection.tsx reecrit : fond blanc #FFFFFF, halo vert discret derriere le phone (radial-gradient rgba(29,158,117,0.10) filtre 40px), grille 2 colonnes 1fr/1fr, texte a gauche (badge, titre avec 'reviennent' en gradient teal, subtitle, CTAs teal + outline, metrics, social proof), PhoneMockup a droite. HeroCanvas retire du hero (fichier conserve mais non importe)." ^
           -m "TypeScript : zero erreur v5."

if errorlevel 1 (
    echo     Commit echoue ou rien a commiter.
)

echo.
echo [6/6] Push vers origin/master...
git push origin master

echo.
echo =========== TERMINE ===========
echo Surveille Vercel build ^(2-3 min^). Quand READY, ouvre :
echo    https://stampify.ch/v5
echo.
echo Compare avec topanga.io / searchable.com / karumi.ai
echo et dis-moi ITER 91 (ajustements de shadow/float/position).
echo.

endlocal
