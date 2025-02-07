// Global app variable
let app;

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        app = new MercuryMonitoring();
        app.init();
        
        // Debug log
        console.log('Mercury Monitoring started');
    } catch (error) {
        console.error('Error initializing Mercury Monitoring:', error);
    }
});