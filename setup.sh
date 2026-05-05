#!/bin/bash

# 0. Domain Input (Optional for SSL)
DOMAIN=$1
if [ -z "$DOMAIN" ]; then
    echo "🌐 No domain provided as argument. Running in IP-only mode."
    echo "💡 To use SSL, run: sudo bash setup.sh yourdomain.com"
fi

set -e

echo "🚀 Starting Universal School CRM Deployment..."
echo "---------------------------------------------------"

# 1. IP Detection (Private/NATed vs Public)
PRIVATE_IP=$(hostname -I | awk '{print $1}')
PUBLIC_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || curl -s api.ipify.org || echo "Unknown")
echo "🔍 Network: Private IP ($PRIVATE_IP), Public IP ($PUBLIC_IP)"

# 1. Root/Sudo Check
if [[ $EUID -ne 0 ]]; then
   echo "⚠️ Not running as root. Will attempt to use 'sudo' for administrative tasks."
   SUDO="sudo"
else
   SUDO=""
fi

# 2. Identify Package Manager & OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
fi

echo "🔍 Detected OS: $OS ($VER)"

# Function to wait for apt/dpkg locks
wait_for_lock() {
    if [ -x "$(command -v apt-get)" ]; then
        echo "🔍 Checking for package manager locks..."
        while $SUDO fuser /var/lib/dpkg/lock >/dev/null 2>&1 || $SUDO fuser /var/lib/apt/lists/lock >/dev/null 2>&1 || $SUDO fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do
            echo "⏳ Waiting for other package manager process to finish (apt is busy)..."
            sleep 5
        done
    fi
}

if [ -x "$(command -v apt-get)" ]; then
    PKG_MANAGER="apt-get"
    UPDATE_CMD="apt-get update"
    INSTALL_CMD="apt-get install -y"
    wait_for_lock
elif [ -x "$(command -v dnf)" ]; then
    PKG_MANAGER="dnf"
    UPDATE_CMD="dnf check-update || true"
    INSTALL_CMD="dnf install -y"
elif [ -x "$(command -v yum)" ]; then
    PKG_MANAGER="yum"
    UPDATE_CMD="yum check-update || true"
    INSTALL_CMD="yum install -y"
elif [ -x "$(command -v pacman)" ]; then
    PKG_MANAGER="pacman"
    UPDATE_CMD="pacman -Sy"
    INSTALL_CMD="pacman -S --noconfirm"
elif [ -x "$(command -v zypper)" ]; then
    PKG_MANAGER="zypper"
    UPDATE_CMD="zypper refresh"
    INSTALL_CMD="zypper install -y"
else
    echo "❌ Unrecognized package manager. Trying official Docker script anyway..."
fi

# 3. Install Git & Prerequisites
echo "📦 Installing prerequisites..."
if [ "$PKG_MANAGER" == "pacman" ]; then
    $SUDO $INSTALL_CMD git curl openssl nginx certbot python-certbot-nginx || true
else
    $SUDO $UPDATE_CMD
    $SUDO $INSTALL_CMD git curl openssl nginx certbot python3-certbot-nginx || true
fi

# 4. Universal Docker Installation
if ! [ -x "$(command -v docker)" ]; then
  echo "🐳 Installing Docker via official convenience script..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  $SUDO sh get-docker.sh
  $SUDO systemctl enable --now docker || $SUDO service docker start || true
  echo "✅ Docker installed."
else
  echo "✅ Docker is already installed."
fi

# 5. Docker Compose Check (Plugin mode)
if ! docker compose version > /dev/null 2>&1; then
  echo "📦 Installing Docker Compose Plugin..."
  if [ "$PKG_MANAGER" == "apt-get" ]; then
    $SUDO $INSTALL_CMD docker-compose-plugin
  else
    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" -o /usr/local/bin/docker-compose
    $SUDO chmod +x /usr/local/bin/docker-compose
    $SUDO ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose || true
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
    
    # Update FRONTEND_URL based on domain or IP
    if [ -z "$DOMAIN" ]; then
      # Prefer Public IP for external access if available
      if [ "$PUBLIC_IP" != "Unknown" ]; then
        APP_IP=$PUBLIC_IP
      else
        APP_IP=$PRIVATE_IP
      fi
      sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=http://$APP_IP:3000|" .env
      echo "🌐 FRONTEND_URL set to: http://$APP_IP:3000"
    else
      sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://$DOMAIN|" .env
      echo "🌐 FRONTEND_URL set to domain: https://$DOMAIN"
    fi

    echo "✅ .env file created with unique keys."
  else
    echo "⚠️ .env.example not found. Using defaults from docker-compose."
  fi
else
  echo "✅ .env file already exists."
fi

# 7. Open Firewall Port
if [ -x "$(command -v ufw)" ]; then
    echo "🔓 Opening port 3000 (UFW)..."
    $SUDO ufw allow 3000/tcp || true
elif [ -x "$(command -v firewall-cmd)" ]; then
    echo "🔓 Opening port 3000 (FirewallD)..."
    $SUDO firewall-cmd --permanent --add-port=3000/tcp || true
    $SUDO firewall-cmd --reload || true
fi

# 8. Start CRM
echo "⚡ Building and starting containers (this may take a few minutes)..."
$SUDO docker compose up -d --build

# 9. SSL & Domain Configuration (Nginx)
if [ ! -z "$DOMAIN" ]; then
    echo "🌐 Configuring Domain & SSL for $DOMAIN..."
    
    # Create Nginx Config
    $SUDO tee /etc/nginx/sites-available/school_crm > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # Enable Config
    $SUDO ln -s /etc/nginx/sites-available/school_crm /etc/nginx/sites-enabled/ || true
    $SUDO rm /etc/nginx/sites-enabled/default || true
    $SUDO systemctl restart nginx

    # Obtain SSL Certificate
    echo "🔒 Obtaining SSL Certificate (Let's Encrypt)..."
    $SUDO certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email || true
    
    $SUDO systemctl restart nginx
    echo "✅ SSL configured successfully!"
fi

# 8. Final Status
echo "---------------------------------------------------"
echo "🎉 Setup Complete on $PKG_MANAGER based system!"
echo "---------------------------------------------------"
if [ ! -z "$DOMAIN" ]; then
    echo "📍 Application: https://$DOMAIN"
else
    echo "📍 Application (Private/NATed): http://$PRIVATE_IP:3000"
    echo "📍 Application (Public IP):      http://$PUBLIC_IP:3000"
fi
echo "📊 Database:    Internal (Port 27017)"
echo "---------------------------------------------------"
echo "💡 Note: Please ensure port 3000 is open in your firewall."
echo "💡 To view logs: docker compose logs -f"
echo "---------------------------------------------------"
