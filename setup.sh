#!/bin/bash

# =================================================================
# School CRM - Automated VPS Setup Script
# =================================================================

set -e

echo "---------------------------------------------------"
echo "🚀 Starting School CRM Deployment..."
echo "---------------------------------------------------"

# 1. Root Check
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script must be run as root (use sudo)"
   exit 1
fi

# 2. Check for Docker
if ! [ -x "$(command -v docker)" ]; then
  echo "📦 Docker not found. Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  systemctl enable --now docker
  echo "✅ Docker installed."
else
  echo "✅ Docker is already installed."
fi

# 3. Check for Docker Compose
if ! docker compose version > /dev/null 2>&1; then
  echo "📦 Docker Compose plugin not found. Installing..."
  apt-get update
  apt-get install -y docker-compose-plugin
  echo "✅ Docker Compose installed."
else
  echo "✅ Docker Compose is already installed."
fi

# 4. Prepare Environment
if [ ! -f .env ]; then
  echo "📝 Creating default .env file..."
  if [ -f .env.example ]; then
    cp .env.example .env
    # Generate random secrets for security
    sed -i "s/YOUR_SECURE_JWT_SECRET/$(openssl rand -hex 32)/g" .env
    sed -i "s/YOUR_SECURE_JWT_REFRESH_ACCESS_SECRET/$(openssl rand -hex 32)/g" .env
    sed -i "s/YOUR_SECURE_JWT_REFRESH_SECRET/$(openssl rand -hex 32)/g" .env
    sed -i "s/YOUR_SECURE_JWT_RESET_SECRET/$(openssl rand -hex 32)/g" .env
    echo "✅ .env file created with secure random secrets."
  else
    echo "⚠️ .env.example not found. Please create a .env file manually."
  fi
else
  echo "✅ .env file already exists."
fi

# 5. Build and Start Containers
echo "⚡ Building and starting containers (this may take a few minutes)..."
docker compose up -d --build

# 6. Final Status
echo "---------------------------------------------------"
echo "🎉 Setup Complete!"
echo "---------------------------------------------------"
echo "📍 Application: http://$(curl -s ifconfig.me):3000"
echo "📊 Database:    Internal (Port 27017)"
echo "---------------------------------------------------"
echo "💡 Note: Please ensure port 3000 is open in your firewall."
echo "💡 To view logs: docker compose logs -f"
echo "---------------------------------------------------"
