import { useState, useEffect } from 'react';
import { Monitor, StatusHistory, Incident, NotificationChannel, MaintenanceWindow, Certificate } from '../types';
// import { mockMonitors, ... } from '../data/mockData';

const API_URL = 'http://localhost:3001/api/monitors';
const INCIDENT_API_URL = 'http://localhost:3001/api/incidents';
const STATUS_PAGE_API_URL = 'http://localhost:3001/api/status-pages';
const NOTIFICATION_CHANNEL_API_URL = 'http://localhost:3001/api/notification-channels';
const MAINTENANCE_WINDOW_API_URL = 'http://localhost:3001/api/maintenance-windows';
const CERTIFICATE_API_URL = 'http://localhost:3001/api/certificates';
const STATUS_HISTORY_API_URL = 'http://localhost:3001/api/status-history';

export function useMonitors() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [statusPages, setStatusPages] = useState<any[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([]);
  const [maintenanceWindows, setMaintenanceWindows] = useState<MaintenanceWindow[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  // Monitörleri backend'den çek
  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setMonitors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Incident'ları backend'den çek
  useEffect(() => {
    fetch(INCIDENT_API_URL)
      .then(res => res.json())
      .then(data => setIncidents(data));
  }, []);

  // Status Page'leri backend'den çek
  useEffect(() => {
    fetch(STATUS_PAGE_API_URL)
      .then(res => res.json())
      .then(data => setStatusPages(data));
  }, []);

  // Notification Channels'ı backend'den çek
  useEffect(() => {
    fetch(NOTIFICATION_CHANNEL_API_URL)
      .then(res => res.json())
      .then(data => setNotificationChannels(data));
  }, []);

  // Maintenance Windows'ı backend'den çek
  useEffect(() => {
    fetch(MAINTENANCE_WINDOW_API_URL)
      .then(res => res.json())
      .then(data => setMaintenanceWindows(data));
  }, []);

  // Certificates'ı backend'den çek
  useEffect(() => {
    fetch(CERTIFICATE_API_URL)
      .then(res => res.json())
      .then(data => setCertificates(data));
  }, []);

  // Status History'yi backend'den çek
  useEffect(() => {
    fetch(STATUS_HISTORY_API_URL)
      .then(res => res.json())
      .then(data => setStatusHistory(data));
  }, []);

  // Monitör ekle
  const addMonitor = async (monitorData: Omit<Monitor, 'id' | 'status' | 'responseTime' | 'uptime' | 'lastCheck' | 'createdAt'>) => {
    setLoading(true);
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(monitorData)
    });
    if (res.ok) {
      // Monitor eklendikten sonra monitörleri tekrar fetch et
      const monitorsRes = await fetch(API_URL);
      const data = await monitorsRes.json();
      setMonitors(data);
    }
    setLoading(false);
  };

  // Monitör güncelle
  const updateMonitor = async (id: string, updates: Partial<Monitor>) => {
    setLoading(true);
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    setMonitors(prev => prev.map(monitor => monitor.id === id ? { ...monitor, ...updates } : monitor));
    setLoading(false);
  };

  // Monitör sil
  const deleteMonitor = async (id: string) => {
    setLoading(true);
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setMonitors(prev => prev.filter(monitor => monitor.id !== id));
    setLoading(false);
  };

  // Incident ekle
  const addIncident = async (incidentData: Omit<Incident, 'id'>) => {
    const res = await fetch(INCIDENT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData)
    });
    if (res.ok) {
      const { id } = await res.json();
      setIncidents(prev => [...prev, { ...incidentData, id } as Incident]);
    }
  };

  // Incident güncelle
  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    await fetch(`${INCIDENT_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    setIncidents(prev => prev.map(incident => incident.id === id ? { ...incident, ...updates } : incident));
  };

  // Incident sil
  const deleteIncident = async (id: string) => {
    await fetch(`${INCIDENT_API_URL}/${id}`, { method: 'DELETE' });
    setIncidents(prev => prev.filter(incident => incident.id !== id));
  };

  // Status Page ekle
  const addStatusPage = async (statusPageData: Omit<any, 'id'>) => {
    const res = await fetch(STATUS_PAGE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusPageData)
    });
    if (res.ok) {
      const { id } = await res.json();
      setStatusPages(prev => [...prev, { ...statusPageData, id }]);
    }
  };

  // Status Page güncelle
  const updateStatusPage = async (id: string, updates: Partial<any>) => {
    await fetch(`${STATUS_PAGE_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    setStatusPages(prev => prev.map(page => page.id === id ? { ...page, ...updates } : page));
  };

  // Status Page sil
  const deleteStatusPage = async (id: string) => {
    await fetch(`${STATUS_PAGE_API_URL}/${id}`, { method: 'DELETE' });
    setStatusPages(prev => prev.filter(page => page.id !== id));
  };

  // Notification Channel ekle
  const addNotificationChannel = async (channelData: Omit<NotificationChannel, 'id' | 'createdAt'>) => {
    const res = await fetch(NOTIFICATION_CHANNEL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(channelData)
    });
    if (res.ok) {
      const { id } = await res.json();
      setNotificationChannels(prev => [...prev, { ...channelData, id } as NotificationChannel]);
    }
  };

  // Notification Channel güncelle
  const updateNotificationChannel = async (id: string, updates: Partial<NotificationChannel>) => {
    await fetch(`${NOTIFICATION_CHANNEL_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    setNotificationChannels(prev => prev.map(channel => channel.id === id ? { ...channel, ...updates } : channel));
  };

  // Notification Channel sil
  const deleteNotificationChannel = async (id: string) => {
    await fetch(`${NOTIFICATION_CHANNEL_API_URL}/${id}`, { method: 'DELETE' });
    setNotificationChannels(prev => prev.filter(channel => channel.id !== id));
  };

  // Maintenance Window ekle
  const addMaintenanceWindow = async (maintenanceData: Omit<MaintenanceWindow, 'id' | 'createdAt'>) => {
    const res = await fetch(MAINTENANCE_WINDOW_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maintenanceData)
    });
    if (res.ok) {
      const { id } = await res.json();
      setMaintenanceWindows(prev => [...prev, { ...maintenanceData, id } as MaintenanceWindow]);
    }
  };

  // Maintenance Window güncelle
  const updateMaintenanceWindow = async (id: string, updates: Partial<MaintenanceWindow>) => {
    await fetch(`${MAINTENANCE_WINDOW_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    setMaintenanceWindows(prev => prev.map(mw => mw.id === id ? { ...mw, ...updates } : mw));
  };

  // Maintenance Window sil
  const deleteMaintenanceWindow = async (id: string) => {
    await fetch(`${MAINTENANCE_WINDOW_API_URL}/${id}`, { method: 'DELETE' });
    setMaintenanceWindows(prev => prev.filter(mw => mw.id !== id));
  };

  // Sertifika ekle
  const addCertificate = async (certificateData: Omit<Certificate, 'id' | 'createdAt'>) => {
    const res = await fetch(CERTIFICATE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificateData)
    });
    if (res.ok) {
      const { id } = await res.json();
      setCertificates(prev => [...prev, { ...certificateData, id } as Certificate]);
    }
  };

  // Sertifika güncelle
  const updateCertificate = async (id: string, updates: Partial<Certificate>) => {
    await fetch(`${CERTIFICATE_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    setCertificates(prev => prev.map(cert => cert.id === id ? { ...cert, ...updates } : cert));
  };

  // Sertifika sil
  const deleteCertificate = async (id: string) => {
    await fetch(`${CERTIFICATE_API_URL}/${id}`, { method: 'DELETE' });
    setCertificates(prev => prev.filter(cert => cert.id !== id));
  };

  // Status History ekle
  const addStatusHistory = async (historyData: Omit<StatusHistory, 'id'>) => {
    const res = await fetch(STATUS_HISTORY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(historyData)
    });
    if (res.ok) {
      const { id } = await res.json();
      setStatusHistory(prev => [...prev, { ...historyData, id } as StatusHistory]);
    }
  };

  // Status History güncelle
  const updateStatusHistory = async (id: string, updates: Partial<StatusHistory>) => {
    await fetch(`${STATUS_HISTORY_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    setStatusHistory(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  // Status History sil
  const deleteStatusHistory = async (id: string) => {
    await fetch(`${STATUS_HISTORY_API_URL}/${id}`, { method: 'DELETE' });
    setStatusHistory(prev => prev.filter(h => h.id !== id));
  };

  const searchMonitors = (query: string): Monitor[] => {
    if (!query.trim()) return monitors;
    return monitors.filter(monitor =>
      monitor.name.toLowerCase().includes(query.toLowerCase()) ||
      monitor.url?.toLowerCase().includes(query.toLowerCase()) ||
      monitor.description?.toLowerCase().includes(query.toLowerCase()) ||
      monitor.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const pauseMonitor = (id: string) => {
    const monitor = monitors.find(m => m.id === id);
    if (!monitor) return;
    updateMonitor(id, {
      ...monitor,
      status: 'paused',
      isActive: 0
    });
  };

  const resumeMonitor = (id: string) => {
    const monitor = monitors.find(m => m.id === id);
    if (!monitor) return;
    updateMonitor(id, {
      ...monitor,
      status: 'pending',
      isActive: 1
    });
  };

  // Diğer fonksiyonlar mock olarak kalacak, ileride API'ya bağlanacak

  return {
    monitors,
    statusPages,
    statusHistory,
    incidents,
    notificationChannels,
    maintenanceWindows,
    certificates,
    loading,
    addMonitor,
    updateMonitor,
    deleteMonitor,
    searchMonitors,
    pauseMonitor,
    resumeMonitor,
    addIncident,
    updateIncident,
    deleteIncident,
    addStatusPage,
    updateStatusPage,
    deleteStatusPage,
    addNotificationChannel,
    updateNotificationChannel,
    deleteNotificationChannel,
    addMaintenanceWindow,
    updateMaintenanceWindow,
    deleteMaintenanceWindow,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addStatusHistory,
    updateStatusHistory,
    deleteStatusHistory,
  };
}