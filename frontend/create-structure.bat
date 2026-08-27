@echo off
echo Creation de la structure...

REM Supprimer l'ancien dossier app
if exist "src\app" rmdir /s /q "src\app"

REM Creer les dossiers
mkdir "src\app"
mkdir "src\app\(public)"
mkdir "src\app\admin"
mkdir "src\app\admin-new"
mkdir "src\app\agenda"
mkdir "src\app\confidentialite"
mkdir "src\app\observatoire"
mkdir "src\app\recherche"

REM Dossiers publics
mkdir "src\app\(public)\a-propos"
mkdir "src\app\(public)\actualites"
mkdir "src\app\(public)\actualites\[slug]"
mkdir "src\app\(public)\contact"
mkdir "src\app\(public)\documentation"
mkdir "src\app\(public)\faq"
mkdir "src\app\(public)\galerie"
mkdir "src\app\(public)\mentions-legales"
mkdir "src\app\(public)\opportunites"
mkdir "src\app\(public)\partenaires"
mkdir "src\app\(public)\partenaires\[slug]"
mkdir "src\app\(public)\programmes"
mkdir "src\app\(public)\programmes\[slug]"
mkdir "src\app\(public)\projets"
mkdir "src\app\(public)\projets\[slug]"

REM Dossiers admin
mkdir "src\app\admin\login"
mkdir "src\app\admin\dashboard"
mkdir "src\app\admin\actualites"
mkdir "src\app\admin\projets"
mkdir "src\app\admin\programmes"
mkdir "src\app\admin\partenaires"
mkdir "src\app\admin\documents"
mkdir "src\app\admin\opportunites"
mkdir "src\app\admin\evenements"
mkdir "src\app\admin\galerie"
mkdir "src\app\admin\medias"
mkdir "src\app\admin\observatoire"
mkdir "src\app\admin\equipe"
mkdir "src\app\admin\faq"
mkdir "src\app\admin\pages"
mkdir "src\app\admin\parametres"
mkdir "src\app\admin\utilisateurs"

REM Dossiers components
mkdir "src\components\layout"
mkdir "src\components\ui"
mkdir "src\components\admin"
mkdir "src\components\features"
mkdir "src\components\shared"
mkdir "src\components\features\actualites"
mkdir "src\components\features\agenda"
mkdir "src\components\features\documents"
mkdir "src\components\features\galerie"
mkdir "src\components\features\observatoire"
mkdir "src\components\features\opportunites"
mkdir "src\components\features\partenaires"
mkdir "src\components\features\programmes"
mkdir "src\components\features\projets"

REM Dossiers fonctionnels
mkdir "src\config"
mkdir "src\constants"
mkdir "src\contexts"
mkdir "src\hooks"
mkdir "src\lib"
mkdir "src\services"
mkdir "src\styles"
mkdir "src\types"

echo Dossiers crees.

REM ------------------------------------------------------------
REM Creation des fichiers avec contenu minimal
REM ------------------------------------------------------------

REM Layout racine
(
echo export default function RootLayout({ children }: { children: React.ReactNode }) {
echo   return (
echo     ^<html lang="fr"^>
echo       ^<body^>{children}^</body^>
echo     ^</html^>
echo   );
echo }
) > "src\app\layout.tsx"

REM Layout public
(
echo import Header from '@/components/layout/Header';
echo import Footer from '@/components/layout/Footer';
echo.
echo export default function PublicLayout({ children }: { children: React.ReactNode }) {
echo   return (
echo     ^<^>
echo       ^<Header /^>
echo       ^<main^>{children}^</main^>
echo       ^<Footer /^>
echo     ^</^>
echo   );
echo }
) > "src\app\(public)\layout.tsx"

REM Page accueil
echo export default function HomePage() { return ^<h1^>Accueil^</h1^>; } > "src\app\(public)\page.tsx"

REM Pages publiques simples
for %%i in (a-propos contact documentation faq galerie mentions-legales opportunites) do (
  echo export default function Page() { return ^<h1^>Page^</h1^>; } > "src\app\(public)\%%i\page.tsx"
)

REM Pages liste (actualites, partenaires, programmes, projets)
for %%i in (actualites partenaires programmes projets) do (
  echo export default function ListPage() { return ^<h1^>Liste^</h1^>; } > "src\app\(public)\%%i\page.tsx"
)

REM Pages detail [slug]
for %%i in (actualites partenaires programmes projets) do (
  echo export default function DetailPage({ params }: { params: { slug: string } }) { return ^<h1^>Detail : {params.slug}^</h1^>; } > "src\app\(public)\%%i\[slug]\page.tsx"
)

REM Layout admin
(
echo import AdminLayout from '@/components/ui/AdminLayout';
echo.
echo export default function Layout({ children }: { children: React.ReactNode }) {
echo   return ^<AdminLayout^>{children}^</AdminLayout^>;
echo }
) > "src\app\admin\layout.tsx"

REM Pages admin
for %%i in (login dashboard actualites projets programmes partenaires documents opportunites evenements galerie medias observatoire equipe faq pages parametres utilisateurs) do (
  echo export default function AdminPage() { return ^<h1^>Administration - Page^</h1^>; } > "src\app\admin\%%i\page.tsx"
)

REM Pages autonomes (agenda, confidentialite, observatoire, recherche)
for %%i in (agenda confidentialite observatoire recherche) do (
  echo export default function Page() { return ^<h1^>Page^</h1^>; } > "src\app\%%i\page.tsx"
)

REM ------------------------------------------------------------
REM Fichiers vides (composants, config, lib, etc.)
REM ------------------------------------------------------------
type nul > "src\app\globals.css"
type nul > "src\app\admin-new\layout.tsx"

type nul > "src\components\layout\Header.tsx"
type nul > "src\components\layout\Footer.tsx"
type nul > "src\components\ui\AdminLayout.tsx"
type nul > "src\components\ui\Button.tsx"
type nul > "src\components\ui\Card.tsx"
type nul > "src\components\ui\Input.tsx"
type nul > "src\components\ui\Loading.tsx"

type nul > "src\config\api.ts"
type nul > "src\constants\index.ts"
type nul > "src\contexts\index.ts"
type nul > "src\hooks\useApi.ts"
type nul > "src\lib\admin-api.ts"
type nul > "src\lib\api-client.ts"
type nul > "src\lib\auth.tsx"
type nul > "src\lib\providers.tsx"
type nul > "src\services\api.ts"
type nul > "src\types\index.ts"

echo Fichiers crees.
echo Structure terminee avec succes !
pause