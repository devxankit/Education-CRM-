#!/bin/bash

# =================================================================
# School CRM - Universal Automated VPS Setup Script
# Works on: Ubuntu, Debian, CentOS, Fedora, RHEL
# =================================================================

set -e

echo "---------------------------------------------------"
echo "🚀 Starting Universal School CRM Deployment..."
echo "---------------------------------------------------"

# 1. Root Check
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script must be run as root (use sudo)"
   exit 1
fi

# 2. Identify Package Manager
if [ -x "$(command -v apt-get)" ]; then
    PKG_MANAGER="apt-get"
    UPDATE_CMD="apt-get update"
    INSTALL_CMD="apt-get install -y"
elif [ -x "$(command -v dnf)" ]; then
    PKG_MANAGER="dnf"
    UPDATE_CMD="dnf check-update || true"
    INSTALL_CMD="dnf install -y"
elif [ -x "$(command -v yum)" ]; then
    PKG_MANAGER="yum"
    UPDATE_CMD="yum check-update || true"
    INSTALL_CMD="yum install -y"
else
    echo "❌ Unrecognized package manager. Please install Docker manually."
    exit 1
fi

echo "📦 OS identified. Using $PKG_MANAGER for installations."

# 3. Install Git & Prerequisites
$UPDATE_CMD
$INSTALL_CMD git curl openssl

# 4. Universal Docker Installation
if ! [ -x "$(command -v docker)" ]; then
  echo "🐳 Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  systemctl enable --now docker
  echo "✅ Docker installed."
else
  echo "✅ Docker is already installed."
fi

# 5. Docker Compose Check (Plugin mode)
if ! docker compose version > /dev/null 2>&1; then
  echo "📦 Installing Docker Compose Plugin..."
  if [ "$PKG_MANAGER" == "apt-get" ]; then
    $INSTALL_CMD docker-compose-plugin
  else
    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose || true
  fi
  echo "✅ Docker Compose ready."
fi

# 6. Environment Setup (.env generation)
if [ ! -f .env ]; then
  echo "📝 Generating secure .env file..."
  if [ -f .env.example ]; then
    cp .env.example .env
    # Secure random key generation for JWT secrets
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$(openssl rand -hex 32)/" .env
    sed -i "s/JWT_REFRESH_ACESS_SECRET=.*/JWT_REFRESH_ACESS_SECRET=$(openssl rand -hex 32)/" .env
    sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$(openssl rand -hex 32)/" .env
    sed -i "s/JWT_RESET_SECRET=.*/JWT_RESET_SECRET=$(openssl rand -hex 32)/" .env
    echo "✅ .env file created with unique keys."
  else
    echo "⚠️ .env.example not found. Using defaults from docker-compose."
  fi
else
  echo "✅ .env file already exists."
fi

# 7. Start CRM
echo "⚡ Building and starting containers (this may take a few minutes)..."
docker compose up -d --build

# 8. Final Status
echo "---------------------------------------------------"
echo "🎉 Setup Complete on $PKG_MANAGER based system!"
echo "---------------------------------------------------"
echo "📍 Application: http://$(curl -s ifconfig.me):3000"
echo "📊 Database:    Internal (Port 27017)"
echo "---------------------------------------------------"
echo "💡 Note: Please ensure port 3000 is open in your firewall."
echo "💡 To view logs: docker compose logs -f"
echo "---------------------------------------------------"
