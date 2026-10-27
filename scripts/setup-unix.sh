#!/usr/bin/env bash
# Spec Kitty class prep: macOS and Linux (including a Chromebook's Linux) setup.
# Installs what's missing (Git, Python 3.11+ and pipx), asks for your Git name and email,
# and creates your class workspace in ~/Documents/spec-kitty-class. Safe to run again.
# Run in a terminal:  curl -fsSL <course address>/scripts/setup-unix.sh | bash

set -u

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }
warn() { printf '\033[1;33m%s\033[0m\n' "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }
python_ok() { "$1" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)' >/dev/null 2>&1; }
# Questions read from the keyboard, not from the piped script.
ask() { local answer; printf '%s ' "$1" >/dev/tty; read -r answer </dev/tty; printf '%s' "$answer"; }

OS="$(uname -s)"
SUDO=""
if [ "$(id -u)" -ne 0 ]; then SUDO="sudo"; fi

install_packages() {
  if have apt-get; then
    $SUDO apt-get update -qq && $SUDO apt-get install -y "$@"
  elif have dnf; then
    $SUDO dnf install -y "$@"
  elif have pacman; then
    $SUDO pacman -S --noconfirm "$@"
  else
    warn "Couldn't find apt, dnf or pacman. Install these yourself: $*"
    return 1
  fi
}

printf '\033[1;32mSpec Kitty class prep: setting up this computer.\033[0m\n'
echo "This installs only what's missing. It can take 10 to 20 minutes."
if [ -n "$SUDO" ] && [ "$OS" != "Darwin" ]; then
  echo "Some steps ask for your password. Nothing shows while you type it; that's normal."
fi

step "Git"
if [ "$OS" = "Darwin" ]; then
  # On a Mac, `git` exists as a stub until Apple's command line tools are installed.
  if xcode-select -p >/dev/null 2>&1 && have git; then
    git --version
  elif have brew; then
    brew install git
  else
    xcode-select --install >/dev/null 2>&1
    warn "A window opened to install Apple's command line tools (they include Git)."
    warn "Choose Install, wait until it's finished, then run this script again."
    exit 0
  fi
elif have git; then
  git --version
else
  install_packages git || exit 1
fi

step "Python 3.11 or newer"
PY=""
for candidate in python3 python3.14 python3.13 python3.12 python3.11; do
  if have "$candidate" && python_ok "$candidate"; then PY="$candidate"; break; fi
done
if [ -z "$PY" ]; then
  if [ "$OS" = "Darwin" ]; then
    if have brew; then
      brew install python3 && PY="python3"
    else
      warn "Download and install the newest Python from https://www.python.org/downloads/macos/"
      warn "Then close this terminal, open a new one, and run this script again."
      exit 0
    fi
  else
    install_packages python3 && PY="python3"
  fi
fi
if [ -z "$PY" ] || ! python_ok "$PY"; then
  warn "Your Python is older than 3.11. Tell your trainer before the session; it can still be sorted out."
  PY="${PY:-python3}"
fi
"$PY" --version

step "pipx (Spec Kitty installs with it)"
if ! have pipx; then
  if [ "$OS" = "Darwin" ] && have brew; then
    brew install pipx
  elif [ "$OS" = "Darwin" ]; then
    "$PY" -m pip install --user --quiet pipx
  else
    install_packages pipx || "$PY" -m pip install --user --quiet pipx
  fi
fi
if have pipx; then pipx ensurepath >/dev/null; else "$PY" -m pipx ensurepath >/dev/null; fi

step "Your name and email for Git"
NAME="$(git config --global user.name || true)"
if [ -z "$NAME" ]; then
  NAME="$(ask 'Your name (saved with your work):')"
  git config --global user.name "$NAME"
fi
EMAIL="$(git config --global user.email || true)"
if [ -z "$EMAIL" ]; then
  EMAIL="$(ask 'An email (any email works; it stays on this computer unless you publish your work):')"
  git config --global user.email "$EMAIL"
fi
echo "Git will use: $NAME <$EMAIL>"

step "Your class workspace"
WORKSPACE="$HOME/Documents/spec-kitty-class"
mkdir -p "$WORKSPACE"
if [ ! -d "$WORKSPACE/.git" ]; then
  (
    cd "$WORKSPACE" &&
      git init --quiet &&
      printf '# My Spec Kitty class workspace\n' > README.md &&
      git add README.md &&
      git commit --quiet -m "Start my Spec Kitty class workspace"
  )
fi

step "Done"
git --version
"$PY" --version
if have pipx; then pipx --version; else "$PY" -m pipx --version; fi
printf '\n\033[1;32mYour workspace: %s\033[0m\n' "$WORKSPACE"
echo "Open this folder in your editor (File > Open Folder...)."
echo "Close and reopen any terminals or editors, so they find the new tools."
