import { Client } from 'ssh2';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Setup CRM on a remote VPS via SSH
 * @route   POST /api/v1/deployment/setup-vps
 * @access  Private/Admin (Assuming auth middleware is applied in router)
 */
export const setupRemoteVPS = asyncHandler(async (req, res) => {
    const { host, username, password } = req.body;

    if (!host || !username || !password) {
        res.status(400);
        throw new Error('Please provide host, username and password');
    }

    const conn = new Client();
    let output = '';
    let errorOutput = '';

    conn.on('ready', () => {
        console.log(`Connected to VPS: ${host}`);
        
        // Command to setup the CRM
        // 1. Install git if not present
        // 2. Clone the repo
        // 3. Run setup.sh
        const repo = 'https://github.com/devxankit/Education-CRM-'; 
        const folderName = 'education-crm';
        
        const command = `
            if [ -x "$(command -v apt-get)" ]; then
                echo "${password}" | sudo -S apt-get update && echo "${password}" | sudo -S apt-get install -y git
            elif [ -x "$(command -v dnf)" ]; then
                echo "${password}" | sudo -S dnf install -y git
            elif [ -x "$(command -v yum)" ]; then
                echo "${password}" | sudo -S yum install -y git
            fi && \
            rm -rf ${folderName} && \
            git clone ${repo} ${folderName} && \
            cd ${folderName} && \
            chmod +x setup.sh && \
            echo "${password}" | sudo -S ./setup.sh
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
                // Optionally send real-time updates via Socket.IO if available
                const io = req.app.get('io');
                if (io) io.emit('deployment-log', { host, data: data.toString() });
            }).stderr.on('data', (data) => {
                errorOutput += data.toString();
                const io = req.app.get('io');
                if (io) io.emit('deployment-log', { host, data: data.toString(), isError: true });
            });
        });
    }).on('error', (err) => {
        res.status(500).json({ success: false, message: 'SSH Connection failed', error: err.message });
    }).connect({
        host,
        port: 22,
        username,
        password
    });
});
