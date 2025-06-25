export interface Monitor {
  id: string;
  name: string;
  url: string;
  type: 'http' | 'https' | 'tcp' | 'ping' | 'dns' | 'keyword';
  interval: number; // in seconds
  status: string; // backend'den gelen değerlerle uyumlu olması için
  responseTime: number; // in ms
  uptime: number; // percentage
  lastChecked?: string;
  createdAt: Date;
  notifications: boolean;
  description?: string;
  tags?: string[];
  timeout?: number;
  retries?: number;
  keyword?: string;
  expectedStatusCode?: number;
  headers?: Record<string, string>;
  body?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';
  acceptedStatusCodes?: number[];
  ignoreTls?: boolean;
  maxRedirects?: number;
  port?: number;
  dnsResolveType?: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT';
  dnsResolveServer?: string;
  lastStatus?: string;
  isActive?: number;
}

export interface StatusHistory {
  id: string;
  monitorId: string;
  status: 'up' | 'down';
  responseTime: number;
  timestamp: Date;
  error?: string;
  statusCode?: number;
  ping?: number;
}

export interface DashboardStats {
  totalMonitors: number;
  upMonitors: number;
  downMonitors: number;
  pausedMonitors: number;
  maintenanceMonitors: number;
  averageResponseTime: number;
  totalUptime: number;
  totalChecks: number;
  incidentsToday: number;
  trends?: {
    totalMonitors: { value: number; isPositive: boolean };
    upMonitors: { value: number; isPositive: boolean };
    downMonitors: { value: number; isPositive: boolean };
    averageResponseTime: { value: number; isPositive: boolean };
  };
}

export interface Incident {
  id: string;
  monitorId: string;
  monitorName: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  message: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  timestamp: Date;
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'webhook' | 'slack' | 'discord' | 'telegram' | 'sms';
  config: Record<string, any>;
  enabled: boolean;
  createdAt: Date;
}

export interface StatusPage {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  customDomain?: string;
  theme: 'light' | 'dark' | 'auto';
  showPoweredBy: boolean;
  monitors: string[];
  incidents: string[];
  customCss?: string;
  customJs?: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface MaintenanceWindow {
  id: string;
  title: string;
  description: string;
  monitors: string[];
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'active' | 'completed';
  createdAt: Date;
}

export interface Certificate {
  id: string;
  monitorId: string;
  domain: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  daysUntilExpiry: number;
  isValid: boolean;
  lastChecked: Date;
}

export interface HeartbeatData {
  timestamp: Date;
  status: 'up' | 'down';
  responseTime: number;
  statusCode?: number;
  error?: string;
}