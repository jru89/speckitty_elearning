# Spec Kitty class prep: Windows setup.
# Installs what's missing (Git, Python 3.11+ and pipx), asks for your Git name and email,
# and creates your class workspace in Documents\spec-kitty-class. Safe to run again.
# Run in PowerShell:  irm <course address>/scripts/setup-windows.ps1 | iex

function Step($text) { Write-Host "`n==> $text" -ForegroundColor Cyan }
function Have($command) { [bool](Get-Command $command -ErrorAction SilentlyContinue) }
function Refresh-Path {
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
}
function Winget-Install($id) {
  winget install --id $id -e --source winget --accept-package-agreements --accept-source-agreements
  Refresh-Path
}

Write-Host "Spec Kitty class prep: setting up this computer." -ForegroundColor Green
Write-Host "This installs only what's missing. It can take 10 to 20 minutes."

if (-not (Have "winget")) {
  Write-Host "`nwinget (the Windows package installer) isn't available on this computer." -ForegroundColor Yellow
  Write-Host "Install 'App Installer' from the Microsoft Store and run this again,"
  Write-Host "or follow 'Do it by hand instead' in the course."
  return
}

Step "Git"
if (Have "git") { git --version } else { Winget-Install "Git.Git" }

Step "Python 3.11 or newer"
$pythonOk = $false
if (Have "py") {
  $check = py -c "import sys; print(sys.version_info >= (3, 11))" 2>$null
  $pythonOk = ($check -eq "True")
}
if (-not $pythonOk) { Winget-Install "Python.Python.3.14" }
if (Have "py") { py --version } else { Write-Host "Python was installed, but this window can't find it yet. Close PowerShell, open it again, and run this script once more." -ForegroundColor Yellow; return }

Step "pipx (Spec Kitty installs with it)"
py -m pip install --user --upgrade --quiet pipx
py -m pipx ensurepath
Refresh-Path

Step "Your name and email for Git"
if (-not (Have "git")) { Write-Host "Git was installed, but this window can't find it yet. Close PowerShell, open it again, and run this script once more." -ForegroundColor Yellow; return }
$name = git config --global user.name
if (-not $name) {
  $name = Read-Host "Your name (saved with your work)"
  git config --global user.name "$name"
}
$email = git config --global user.email
if (-not $email) {
  $email = Read-Host "An email (any email works; it stays on this computer unless you publish your work)"
  git config --global user.email "$email"
}
Write-Host "Git will use: $name <$email>"

Step "Your class workspace"
$workspace = Join-Path ([Environment]::GetFolderPath("MyDocuments")) "spec-kitty-class"
New-Item -ItemType Directory -Force -Path $workspace | Out-Null
Push-Location $workspace
if (-not (Test-Path ".git")) {
  git init --quiet
  Set-Content -Path "README.md" -Value "# My Spec Kitty class workspace"
  git add README.md
  git commit --quiet -m "Start my Spec Kitty class workspace"
}
Pop-Location

Step "Done"
git --version
py --version
py -m pipx --version
Write-Host "`nYour workspace: $workspace" -ForegroundColor Green
Write-Host "Open this folder in your editor (File > Open Folder...)."
Write-Host "Close and reopen any terminals or editors, so they find the new tools."
