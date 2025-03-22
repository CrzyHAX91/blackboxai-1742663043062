// Social Media Manager Class
class SocialMediaManager {
    constructor() {
        // Display user email
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email) {
            document.getElementById('userEmail').textContent = user.email;
        }

        this.platforms = {
            instagram: { connected: false, token: null },
            youtube: { connected: false, token: null },
            twitch: { connected: false, token: null }
        };
        this.isStreaming = false;
        this.currentPlatform = null;
        this.streamInterval = null;
        this.initializeUI();
        this.setupEventListeners();
    }

    initializeUI() {
        // Initialize platform connection buttons
        document.querySelectorAll('.connect-btn').forEach(btn => {
            const platform = btn.dataset.platform;
            const statusIndicator = btn.parentElement.nextElementSibling;
            this.updateConnectionStatus(platform, statusIndicator, btn);
        });

        // Initialize stream controls
        this.startStreamBtn = document.getElementById('startStream');
        this.stopStreamBtn = document.getElementById('stopStream');
        this.platformSelect = document.getElementById('platformSelect');
        this.activityLog = document.getElementById('activityLog');
        this.streamPreview = document.getElementById('streamPreview');

        // Initialize logout button
        this.logoutBtn = document.getElementById('logoutBtn');
    }

    setupEventListeners() {
        // Platform connection buttons
        document.querySelectorAll('.connect-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handlePlatformConnection(btn));
        });

        // Stream control buttons
        this.startStreamBtn.addEventListener('click', () => this.startStream());
        this.stopStreamBtn.addEventListener('click', () => this.stopStream());

        // Platform selection
        this.platformSelect.addEventListener('change', () => {
            this.currentPlatform = this.platformSelect.value;
            this.updateStreamControls();
        });

        // Logout button
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    async handlePlatformConnection(btn) {
        const platform = btn.dataset.platform;
        const statusIndicator = btn.parentElement.nextElementSibling;

        try {
            // Simulate authentication process
            this.logActivity(`Connecting to ${platform}...`);
            await this.authenticatePlatform(platform);
            
            this.platforms[platform].connected = true;
            this.platforms[platform].token = 'mock_token_' + Date.now();
            
            this.updateConnectionStatus(platform, statusIndicator, btn);
            this.logActivity(`Successfully connected to ${platform}`);
            this.updateStreamControls();
        } catch (error) {
            this.logActivity(`Failed to connect to ${platform}: ${error.message}`);
        }
    }

    async authenticatePlatform(platform) {
        // Simulate authentication delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real implementation, this would handle OAuth or other authentication methods
        return true;
    }

    updateConnectionStatus(platform, statusIndicator, btn) {
        const isConnected = this.platforms[platform].connected;
        
        statusIndicator.classList.remove('hidden');
        statusIndicator.textContent = isConnected ? 'Connected' : 'Not connected';
        statusIndicator.classList.toggle('text-green-500', isConnected);
        statusIndicator.classList.toggle('text-red-500', !isConnected);
        
        btn.textContent = isConnected ? 'Disconnect' : 'Connect';
        btn.classList.toggle('bg-red-500', isConnected);
        btn.classList.toggle('bg-[#4ECDC4]', !isConnected);
    }

    updateStreamControls() {
        const anyPlatformConnected = Object.values(this.platforms).some(p => p.connected);
        const platformSelected = this.currentPlatform && this.platforms[this.currentPlatform]?.connected;
        
        this.startStreamBtn.disabled = !platformSelected;
        this.stopStreamBtn.disabled = !this.isStreaming;
        
        this.startStreamBtn.classList.toggle('opacity-50', !platformSelected);
        this.stopStreamBtn.classList.toggle('opacity-50', !this.isStreaming);
    }

    async startStream() {
        if (!this.currentPlatform || !this.platforms[this.currentPlatform].connected) {
            this.logActivity('Please select a connected platform before starting the stream');
            return;
        }

        try {
            this.isStreaming = true;
            this.logActivity(`Starting stream on ${this.currentPlatform}...`);
            
            // Simulate stream preview
            this.streamPreview.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-broadcast-tower text-4xl text-green-500 mb-2"></i>
                    <p class="text-green-500">Streaming to ${this.currentPlatform}</p>
                </div>
            `;

            // Update UI
            this.updateStreamControls();
            
            // Simulate periodic stream status updates
            this.streamInterval = setInterval(() => {
                this.logActivity(`Stream running on ${this.currentPlatform} - ${new Date().toLocaleTimeString()}`);
            }, 5000);

        } catch (error) {
            this.isStreaming = false;
            this.logActivity(`Failed to start stream: ${error.message}`);
            this.updateStreamControls();
        }
    }

    async stopStream() {
        if (!this.isStreaming) return;

        try {
            clearInterval(this.streamInterval);
            this.isStreaming = false;
            this.logActivity(`Stopped streaming on ${this.currentPlatform}`);
            
            // Reset stream preview
            this.streamPreview.innerHTML = '<i class="fas fa-video text-4xl text-gray-600"></i>';
            
            // Update UI
            this.updateStreamControls();

        } catch (error) {
            this.logActivity(`Error stopping stream: ${error.message}`);
        }
    }

    logActivity(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'text-sm text-gray-400';
        logEntry.innerHTML = `<span class="text-[#4ECDC4]">[${timestamp}]</span> ${message}`;
        
        this.activityLog.insertBefore(logEntry, this.activityLog.firstChild);
        
        // Keep only the last 100 log entries to prevent memory issues
        while (this.activityLog.children.length > 100) {
            this.activityLog.removeChild(this.activityLog.lastChild);
        }
    }

    async handleLogout() {
        if (this.isStreaming) {
            await this.stopStream();
        }

        // Disconnect all platforms
        for (const platform in this.platforms) {
            this.platforms[platform].connected = false;
            this.platforms[platform].token = null;
        }

        // Update UI
        document.querySelectorAll('.connect-btn').forEach(btn => {
            const platform = btn.dataset.platform;
            const statusIndicator = btn.parentElement.nextElementSibling;
            this.updateConnectionStatus(platform, statusIndicator, btn);
        });

        this.logActivity('Logged out successfully');
        
        // In a real implementation, this would redirect to the login page
        // window.location.href = 'login.html';
    }
}

// Initialize the Social Media Manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.socialMediaManager = new SocialMediaManager();
});