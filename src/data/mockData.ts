import { Monitor, StatusHistory, DashboardStats, Incident, NotificationChannel, StatusPage, MaintenanceWindow, Certificate } from '../types';

export const mockMonitors: Monitor[] = [
  {
    id: '1',
    name: 'Main Website',
    url: 'https://example.com',
    type: 'https',
    interval: 60,
    status: 'up',
    responseTime: 245,
    uptime: 99.9,
    lastCheck: new Date(Date.now() - 30000),
    createdAt: new Date('2024-01-15'),
    notifications: true,
    description: 'Primary company website',
    tags: ['production', 'critical'],
    timeout: 30,
    retries: 3,
    expectedStatusCode: 200,
    method: 'GET',
    acceptedStatusCodes: [200, 201, 202],
    ignoreTls: false,
    maxRedirects: 5
  },
  {
    id: '2',
    name: 'API Server',
    url: 'https://api.example.com/health',
    type: 'https',
    interval: 30,
    status: 'up',
    responseTime: 124,
    uptime: 99.8,
    lastCheck: new Date(Date.now() - 15000),
    createdAt: new Date('2024-01-10'),
    notifications: true,
    description: 'REST API endpoint',
    tags: ['api', 'production'],
    timeout: 15,
    retries: 2,
    expectedStatusCode: 200,
    method: 'GET',
    headers: { 'Authorization': 'Bearer token123' }
  },
  {
    id: '3',
    name: 'Database Server',
    url: 'db.example.com',
    type: 'tcp',
    interval: 120,
    status: 'down',
    responseTime: 0,
    uptime: 98.2,
    lastCheck: new Date(Date.now() - 60000),
    createdAt: new Date('2024-01-08'),
    notifications: true,
    description: 'PostgreSQL database',
    tags: ['database', 'critical'],
    port: 5432,
    timeout: 10,
    retries: 3
  },
  {
    id: '4',
    name: 'CDN Endpoint',
    url: 'https://cdn.example.com',
    type: 'https',
    interval: 300,
    status: 'up',
    responseTime: 89,
    uptime: 99.95,
    lastCheck: new Date(Date.now() - 120000),
    createdAt: new Date('2024-01-12'),
    notifications: false,
    description: 'Content delivery network',
    tags: ['cdn', 'performance']
  },
  {
    id: '5',
    name: 'Payment Gateway',
    url: 'https://payments.example.com',
    type: 'https',
    interval: 60,
    status: 'maintenance',
    responseTime: 0,
    uptime: 99.1,
    lastCheck: new Date(Date.now() - 45000),
    createdAt: new Date('2024-01-20'),
    notifications: true,
    description: 'Stripe payment processing',
    tags: ['payment', 'critical']
  },
  {
    id: '6',
    name: 'DNS Resolution',
    url: 'example.com',
    type: 'dns',
    interval: 300,
    status: 'up',
    responseTime: 45,
    uptime: 99.99,
    lastCheck: new Date(Date.now() - 180000),
    createdAt: new Date('2024-01-25'),
    notifications: true,
    description: 'DNS resolution check',
    tags: ['dns', 'infrastructure'],
    dnsResolveType: 'A',
    dnsResolveServer: '8.8.8.8'
  },
  {
    id: '7',
    name: 'Keyword Monitor',
    url: 'https://example.com/status',
    type: 'keyword',
    interval: 180,
    status: 'up',
    responseTime: 156,
    uptime: 99.7,
    lastCheck: new Date(Date.now() - 90000),
    createdAt: new Date('2024-01-28'),
    notifications: true,
    description: 'Check for specific keyword on status page',
    tags: ['keyword', 'monitoring'],
    keyword: 'operational',
    method: 'GET'
  },
  {
    id: '8',
    name: 'Ping Monitor',
    url: '8.8.8.8',
    type: 'ping',
    interval: 60,
    status: 'up',
    responseTime: 12,
    uptime: 99.98,
    lastCheck: new Date(Date.now() - 25000),
    createdAt: new Date('2024-02-01'),
    notifications: false,
    description: 'Google DNS ping test',
    tags: ['ping', 'network'],
    timeout: 5,
    retries: 3
  }
];

export const mockStatusHistory: StatusHistory[] = Array.from({ length: 168 }, (_, i) => ({
  id: `history-${i}`,
  monitorId: '1',
  status: Math.random() > 0.05 ? 'up' : 'down',
  responseTime: Math.floor(Math.random() * 300) + 100,
  timestamp: new Date(Date.now() - (167 - i) * 60 * 60 * 1000),
  statusCode: Math.random() > 0.05 ? 200 : 500,
}));

export const mockDashboardStats: DashboardStats = {
  totalMonitors: mockMonitors.length,
  upMonitors: mockMonitors.filter(m => m.status === 'up').length,
  downMonitors: mockMonitors.filter(m => m.status === 'down').length,
  pausedMonitors: mockMonitors.filter(m => m.status === 'paused').length,
  maintenanceMonitors: mockMonitors.filter(m => m.status === 'maintenance').length,
  averageResponseTime: Math.floor(mockMonitors.reduce((acc, m) => acc + m.responseTime, 0) / mockMonitors.length),
  totalUptime: Math.floor(mockMonitors.reduce((acc, m) => acc + m.uptime, 0) / mockMonitors.length * 100) / 100,
  totalChecks: 15420,
  incidentsToday: 2
};

export const mockIncidents: Incident[] = [
  {
    id: '1',
    monitorId: '3',
    monitorName: 'Database Server',
    title: 'Database Connection Issues',
    description: 'Experiencing intermittent connection timeouts to the primary database server.',
    status: 'investigating',
    severity: 'major',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updates: [
      {
        id: '1',
        message: 'We are investigating reports of database connection issues.',
        status: 'investigating',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        message: 'Issue has been identified as a network configuration problem.',
        status: 'identified',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: '2',
    monitorId: '1',
    monitorName: 'Main Website',
    title: 'Slow Response Times',
    description: 'Website experiencing slower than normal response times.',
    status: 'resolved',
    severity: 'minor',
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    duration: 2 * 60 * 60 * 1000,
    updates: [
      {
        id: '3',
        message: 'Investigating reports of slow response times.',
        status: 'investigating',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        id: '4',
        message: 'Issue resolved after clearing CDN cache.',
        status: 'resolved',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ]
  }
];

export const mockNotificationChannels: NotificationChannel[] = [
  {
    id: '1',
    name: 'Team Email',
    type: 'email',
    config: { emails: ['admin@example.com', 'ops@example.com'] },
    enabled: true,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'Slack Alerts',
    type: 'slack',
    config: { webhook: 'https://hooks.slack.com/services/...', channel: '#alerts' },
    enabled: true,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Discord Webhook',
    type: 'discord',
    config: { webhook: 'https://discord.com/api/webhooks/...' },
    enabled: false,
    createdAt: new Date('2024-01-15')
  }
];

export const mockStatusPages: StatusPage[] = [
  {
    id: '1',
    name: 'Public Status',
    slug: 'status',
    description: 'Real-time status of all our services',
    theme: 'light',
    showPoweredBy: true,
    monitors: ['1', '2', '4', '5'],
    incidents: ['1', '2'],
    isPublic: true,
    createdAt: new Date('2024-01-20')
  }
];

export const mockMaintenanceWindows: MaintenanceWindow[] = [
  {
    id: '1',
    title: 'Database Maintenance',
    description: 'Scheduled maintenance for database server upgrades',
    monitors: ['3'],
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
    status: 'scheduled',
    createdAt: new Date()
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: '1',
    monitorId: '1',
    domain: 'example.com',
    issuer: 'Let\'s Encrypt',
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-04-01'),
    daysUntilExpiry: 45,
    isValid: true,
    lastChecked: new Date()
  },
  {
    id: '2',
    monitorId: '2',
    domain: 'api.example.com',
    issuer: 'DigiCert',
    validFrom: new Date('2023-12-01'),
    validTo: new Date('2024-12-01'),
    daysUntilExpiry: 280,
    isValid: true,
    lastChecked: new Date()
  }
];