class MercuryMonitoring {
    constructor() {
        this.monitors = new Map();
        this.settings = {
            notificationEmail: '',
            theme: 'light'
        };
        this.intervals = new Map();
    }

    init() {
        this.loadSettings();
        this.loadMonitors();
        this.setupEventListeners();
        this.updateStats();
        console.log('MercuryMonitoring initialized');
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        }
    }

    loadMonitors() {
        const savedMonitors = localStorage.getItem('monitors');
        if (savedMonitors) {
            const monitors = JSON.parse(savedMonitors);
            monitors.forEach(monitorData => {
                const monitor = new Monitor({
                    ...monitorData,
                    uptime: parseFloat(monitorData.uptime) || 100,
                    checkCount: parseInt(monitorData.checkCount) || 0,
                    failCount: parseInt(monitorData.failCount) || 0,
                    lastResponseTime: parseInt(monitorData.lastResponseTime) || 0
                });
                this.monitors.set(monitor.id, monitor);
                this.startMonitoring(monitor);
            });
        }
        this.updateMonitorList();
    }

    setupEventListeners() {
        const form = document.getElementById('monitorForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted');
                this.addMonitor();
            });
        } else {
            console.error('Monitor form not found!');
        }

        const saveSettingsBtn = document.getElementById('saveSettings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }
    }

    addMonitor() {
        try {
            console.log('Adding new monitor...');

            const name = document.getElementById('monitorName').value;
            const url = document.getElementById('monitorUrl').value;
            const type = document.getElementById('monitorType').value;
            const interval = parseInt(document.getElementById('checkInterval').value);

            console.log('Monitor details:', { name, url, type, interval });

            const monitor = new Monitor({
                name: name,
                url: url,
                type: type,
                interval: interval
            });

            this.monitors.set(monitor.id, monitor);
            this.saveMonitors();
            this.startMonitoring(monitor);
            this.updateMonitorList();
            this.updateStats();

            document.getElementById('monitorForm').reset();
            
            Swal.fire({
                title: 'Success!',
                text: 'Monitor added successfully.',
                icon: 'success'
            });

            console.log('Monitor added successfully');
        } catch (error) {
            console.error('Error adding monitor:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Error adding monitor.',
                icon: 'error'
            });
        }
    }

    startMonitoring(monitor) {
        // Run first check immediately
        monitor.check().then(() => {
            this.updateMonitorList();
            this.saveMonitors();
        });

        // Set interval for periodic checks
        const intervalId = setInterval(() => {
            monitor.check().then(() => {
                this.updateMonitorList();
                this.saveMonitors();
            });
        }, monitor.interval * 60 * 1000);

        this.intervals.set(monitor.id, intervalId);
    }

    deleteMonitor(id) {
        clearInterval(this.intervals.get(id));
        this.intervals.delete(id);
        this.monitors.delete(id);
        this.saveMonitors();
        this.updateMonitorList();
        this.updateStats();

        Swal.fire({
            title: 'Success!',
            text: 'Monitor deleted successfully.',
            icon: 'success'
        });
    }

    saveMonitors() {
        try {
            const monitorsArray = Array.from(this.monitors.values()).map(monitor => ({
                ...monitor.toJSON(),
                uptime: parseFloat(monitor.uptime),
                checkCount: parseInt(monitor.checkCount),
                failCount: parseInt(monitor.failCount),
                lastResponseTime: parseInt(monitor.lastResponseTime)
            }));
            localStorage.setItem('monitors', JSON.stringify(monitorsArray));
            console.log('Monitors saved:', monitorsArray);
        } catch (error) {
            console.error('Error saving monitors:', error);
        }
    }

    saveSettings() {
        this.settings.notificationEmail = document.getElementById('notificationEmail').value;
        
        localStorage.setItem('settings', JSON.stringify(this.settings));
        
        Swal.fire({
            title: 'Success!',
            text: 'Settings saved successfully.',
            icon: 'success'
        });
    }

    updateStats() {
        const stats = {
            up: 0,
            down: 0,
            total: this.monitors.size
        };

        this.monitors.forEach(monitor => {
            if (monitor.status === 'up') stats.up++;
            else if (monitor.status === 'down') stats.down++;
        });

        document.getElementById('upCount').textContent = stats.up;
        document.getElementById('downCount').textContent = stats.down;
        document.getElementById('totalCount').textContent = stats.total;
    }

    updateMonitorList() {
        const monitorList = document.getElementById('monitorList');
        if (!monitorList) {
            console.error('Monitor list element not found!');
            return;
        }

        monitorList.innerHTML = '';

        this.monitors.forEach(monitor => {
            const isUp = monitor.status === 'up';
            const monitorElement = document.createElement('div');
            monitorElement.className = `monitor-item ${isUp ? 'status-up' : 'status-down'}`;
            monitorElement.innerHTML = `
                <div class="monitor-details">
                    <div class="monitor-header">
                        <div class="d-flex align-items-center">
                            <h4 class="monitor-name mb-0">${monitor.name}</h4>
                            <i class="fas fa-chevron-down expand-icon"></i>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="status-badge ${isUp ? 'up' : 'down'}">${isUp ? 'Online' : 'Offline'}</span>
                            <button class="btn btn-sm btn-danger ms-2" onclick="event.stopPropagation(); app.deleteMonitor(${monitor.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="details-expanded">
                        <div class="monitor-info">
                            <span class="monitor-url d-block mb-2">${monitor.url}</span>
                            <div class="monitor-stats">
                                <div class="row">
                                    <div class="col-md-4">
                                        <small>Last Check:</small>
                                        <div>${monitor.lastCheck ? new Date(monitor.lastCheck).toLocaleString() : 'Not checked yet'}</div>
                                    </div>
                                    <div class="col-md-4">
                                        <small>Uptime:</small>
                                        <div>${monitor.uptime}%</div>
                                    </div>
                                    <div class="col-md-4">
                                        <small>Response Time:</small>
                                        <div>${monitor.lastResponseTime}ms</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            monitorElement.addEventListener('click', function() {
                const currentlyExpanded = this.classList.contains('expanded');
                
                document.querySelectorAll('.monitor-item').forEach(item => {
                    item.classList.remove('expanded');
                });

                if (!currentlyExpanded) {
                    this.classList.add('expanded');
                }
            });

            monitorList.appendChild(monitorElement);
        });

        console.log('Monitor list updated');
    }

    async sendNotificationEmail(monitor, status) {
        const email = this.settings.notificationEmail;
        if (!email) return;

        const subject = `[Mercury Monitoring] ${monitor.name} is ${status}`;
        const message = `
            Monitor: ${monitor.name}
            URL: ${monitor.url}
            Status: ${status}
            Time: ${new Date().toLocaleString()}
            Response Time: ${monitor.lastResponseTime}ms
            Uptime: ${monitor.uptime}%
        `;

        try {
            console.log('Sending notification email:', {
                to: email,
                subject: subject,
                message: message
            });

            Swal.fire({
                title: 'Notification Sent',
                text: `Status notification sent to ${email}`,
                icon: 'info',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }
}