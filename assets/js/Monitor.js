class Monitor {
    constructor(data) {
        if (!data.name || !data.url) {
            throw new Error('Name and URL are required');
        }

        this.id = data.id || Date.now();
        this.name = data.name;
        this.url = data.url;
        this.type = data.type;
        this.interval = data.interval;
        this.status = data.status || 'unknown';
        this.lastCheck = data.lastCheck || null;
        this.uptime = data.uptime || 100;
        this.checkCount = data.checkCount || 0;
        this.failCount = data.failCount || 0;
        this.lastResponseTime = data.lastResponseTime || 0;

        console.log('New monitor created:', this);
    }

    async check() {
        try {
            const startTime = Date.now();
            const proxyUrl = 'https://api.allorigins.win/get?url=';
            const response = await fetch(proxyUrl + encodeURIComponent(this.url));
            const responseTime = Date.now() - startTime;

            this.checkCount++;
            
            if (response.ok) {
                const data = await response.json();
                if (data.status && data.status.http_code === 200) {
                    // Önceki durum down ise ve şimdi up olduysa bildirim gönder
                    if (this.status === 'down') {
                        app.sendNotificationEmail(this, 'UP');
                    }
                    this.status = 'up';
                    this.lastResponseTime = responseTime;
                } else {
                    if (this.status === 'up') {
                        app.sendNotificationEmail(this, 'DOWN');
                    }
                    this.status = 'down';
                    this.failCount++;
                }
            } else {
                if (this.status === 'up') {
                    app.sendNotificationEmail(this, 'DOWN');
                }
                this.status = 'down';
                this.failCount++;
            }
        } catch (error) {
            if (this.status === 'up') {
                app.sendNotificationEmail(this, 'DOWN');
            }
            this.status = 'down';
            this.failCount++;
            console.error('Error checking monitor:', error);
        }

        this.lastCheck = new Date();
        
        if (this.uptime === 100 && this.checkCount > 0) {
            this.uptime = (((this.checkCount - this.failCount) / this.checkCount) * 100).toFixed(2);
        }
        
        return {
            status: this.status,
            lastCheck: this.lastCheck,
            uptime: this.uptime,
            responseTime: this.lastResponseTime
        };
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            url: this.url,
            type: this.type,
            interval: this.interval,
            status: this.status,
            lastCheck: this.lastCheck,
            uptime: this.uptime,
            checkCount: this.checkCount,
            failCount: this.failCount,
            lastResponseTime: this.lastResponseTime
        };
    }
}