import { Client } from 'ssh2';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Setup CRM on a remote VPS via SSH
 * @route   POST /api/v1/deployment/setup-vps
 * @access  Private/Admin (Assuming auth middleware is applied in router)
 */
export const setupRemoteVPS = asyncHandler(async (req, res) => {
    const { host, username, password, domain, port } = req.body;

    if (!host || !username || !password) {
        res.status(400);
        throw new Error('Please provide host, username and password');
    }

    const sshPort = port || 22;

    const conn = new Client();
    let output = '';
    let errorOutput = '';

    console.log(`Initiating SSH connection to ${host}:${sshPort}...`);

    conn.on('ready', () => {
        console.log(`Connected to VPS: ${host}`);
        
        // Command to setup the CRM
        const repo = 'https://github.com/devxankit/Education-CRM-'; 
        const folderName = 'education-crm';
        
        // Escape password for shell use
        const escapedPassword = password.replace(/'/g, "'\\''");

        const command = `
            # Function to wait for apt/dpkg locks
            wait_for_lock() {
                if [ -x "$(command -v apt-get)" ]; then
                    echo "🔍 Checking for package manager locks..."
                    while sudo fuser /var/lib/dpkg/lock >/dev/null 2>&1 || sudo fuser /var/lib/apt/lists/lock >/dev/null 2>&1 || sudo fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do
                        echo "⏳ Waiting for other package manager process to finish (apt is busy)..."
                        sleep 5
                    done
                fi
            }

            # Function to run with sudo if not root
            run_cmd() {
                if [ "$(id -u)" -ne 0 ]; then
                    echo '${escapedPassword}' | sudo -S "$@"
                else
                    "$@"
                fi
            }

            export DEBIAN_FRONTEND=noninteractive
            
            if [ -x "$(command -v apt-get)" ]; then
                wait_for_lock
                run_cmd apt-get update && run_cmd apt-get install -y git
            elif [ -x "$(command -v dnf)" ]; then
                run_cmd dnf install -y git
            elif [ -x "$(command -v yum)" ]; then
                run_cmd yum install -y git
            fi && \
            rm -rf ${folderName} && \
            git clone ${repo} ${folderName} && \
            cd ${folderName} && \
            chmod +x setup.sh && \
            run_cmd ./setup.sh ${domain || ''}
        `;

        conn.exec(command, (err, stream) => {
            if (err) {
                conn.end();
                return res.status(500).json({ success: false, message: 'SSH Execution failed', error: err.message });
            }

            stream.on('close', (code, signal) => {
                console.log(`Stream closed with code ${code}`);
                conn.end();
                if (code === 0) {
                    res.status(200).json({ 
                        success: true, 
                        message: 'Deployment triggered successfully', 
                        logs: output 
                    });
                } else {
                    res.status(500).json({ 
                        success: false, 
                        message: `Deployment failed with code ${code}`, 
                        logs: output,
                        errors: errorOutput
                    });
                }
            }).on('data', (data) => {
                output += data.toString();
                const io = req.app.get('io');
                if (io) io.emit('deployment-log', { host, data: data.toString() });
            }).stderr.on('data', (data) => {
                errorOutput += data.toString();
                const io = req.app.get('io');
                if (io) io.emit('deployment-log', { host, data: data.toString(), isError: true });
            });
        });
    }).on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
        // Automatically respond to password prompts
        finish([password]);
    }).on('error', (err) => {
        console.error('SSH Connection Error:', err);
        let message = 'SSH Connection failed';
        let hint = 'Check if the IP is correct, port 22 is open, and there are no firewall blocks.';

        if (err.message.includes('handshake')) {
            message = 'SSH Handshake timed out. The server might be slow or unreachable via NAT.';
        } else if (err.message.includes('All configured authentication methods failed')) {
            message = 'SSH Authentication failed';
            hint = 'Verify your username and password. Also, ensure the VPS allows Password Authentication (check /etc/ssh/sshd_config).';
        }

        res.status(500).json({ 
            success: false, 
            message, 
            error: err.message,
            hint
        });
    }).connect({
        host,
        port: sshPort,
        username,
        password,
        tryKeyboardInteractive: true, // Handle cases where server requires keyboard-interactive
        readyTimeout: 60000, 
        keepaliveInterval: 10000, 
        keepaliveCountMax: 3,
        debug: (msg) => { console.log('SSH DEBUG:', msg); }
    });
});
