import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import MonitorList from './components/Monitor/MonitorList';
import MonitorForm from './components/Monitor/MonitorForm';
import IncidentList from './components/Incidents/IncidentList';
import PublicStatusPage from './components/StatusPage/PublicStatusPage';
import MaintenanceList from './components/Maintenance/MaintenanceList';
import CertificateList from './components/Certificates/CertificateList';
import NotificationSettings from './components/Settings/NotificationSettings';
import { useMonitors } from './hooks/useMonitors';
import { Monitor, Incident } from './types';
import AuthForm from './components/Auth/AuthForm';
import Profile from './components/Auth/Profile';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedRange, setSelectedRange] = useState(1/24); // 1 saat varsayılan
  
  const { 
    monitors, 
    statusPages,
    statusHistory,
    incidents,
    notificationChannels,
    maintenanceWindows,
    certificates,
    addMonitor, 
    updateMonitor, 
    deleteMonitor, 
    searchMonitors,
    pauseMonitor,
    resumeMonitor,
    addNotificationChannel,
    updateNotificationChannel,
    deleteNotificationChannel,
    addMaintenanceWindow,
    updateMaintenanceWindow,
    deleteMaintenanceWindow
  } = useMonitors();
  
  // Yardımcı: Geçen haftanın başlangıcı ve bitişi
  function getLastWeekRange() {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // Geçen haftaki monitörler, up, down, response time, vs.
  const { start: lastWeekStart, end: lastWeekEnd } = getLastWeekRange();
  const lastWeekMonitors = monitors.filter(m => {
    const created = new Date(m.createdAt);
    return created >= lastWeekStart && created <= lastWeekEnd;
  });
  const lastWeekUp = lastWeekMonitors.filter(m => m.status === 'up').length;
  const lastWeekDown = lastWeekMonitors.filter(m => m.status === 'down').length;
  const lastWeekAvgResp = lastWeekMonitors.length > 0 ? Math.round(lastWeekMonitors.reduce((sum, m) => sum + (m.responseTime || 0), 0) / lastWeekMonitors.length) : 0;

  // Trend hesaplama yardımcı fonksiyonu
  function calcTrend(current: number, last: number) {
    if (last === 0) return { value: 0, isPositive: true };
    const diff = current - last;
    const percent = Math.round((diff / last) * 100 * 10) / 10;
    return { value: Math.abs(percent), isPositive: percent >= 0 };
  }

  // Gerçek dashboard stats hesaplama
  const stats = {
    totalMonitors: monitors.length,
    upMonitors: monitors.filter(m => m.status === 'up').length,
    downMonitors: monitors.filter(m => m.status === 'down').length,
    averageResponseTime: monitors.length > 0 ? Math.round(monitors.reduce((sum, m) => sum + (m.responseTime || 0), 0) / monitors.length) : 0,
    maintenanceMonitors: maintenanceWindows.length,
    pausedMonitors: monitors.filter(m => m.status === 'paused').length,
    totalChecks: statusHistory.length,
    incidentsToday: incidents.filter(i => {
      const today = new Date();
      const started = new Date(i.startedAt);
      return started.getDate() === today.getDate() && started.getMonth() === today.getMonth() && started.getFullYear() === today.getFullYear();
    }).length,
    totalUptime: monitors.length > 0 ? Math.round(monitors.reduce((sum, m) => sum + (m.uptime || 0), 0) / monitors.length) : 100,
    trends: {
      totalMonitors: calcTrend(monitors.length, lastWeekMonitors.length),
      upMonitors: calcTrend(monitors.filter(m => m.status === 'up').length, lastWeekUp),
      downMonitors: calcTrend(monitors.filter(m => m.status === 'down').length, lastWeekDown),
      averageResponseTime: calcTrend(
        monitors.length > 0 ? Math.round(monitors.reduce((sum, m) => sum + (m.responseTime || 0), 0) / monitors.length) : 0,
        lastWeekAvgResp
      ),
    },
  };

  const filteredMonitors = searchMonitors(searchQuery);

  const handleSaveMonitor = async (monitorData: Omit<Monitor, 'id' | 'status' | 'responseTime' | 'uptime' | 'lastCheck' | 'createdAt'>) => {
    if (editingMonitor) {
      await updateMonitor(editingMonitor.id, monitorData);
      setEditingMonitor(null);
      return { success: true };
    } else {
      try {
        await addMonitor(monitorData);
        setShowAddForm(false);
        return { success: true };
      } catch (err: any) {
        return { error: err?.message || 'Monitor eklenemedi.' };
      }
    }
  };

  const handleEditMonitor = (monitor: Monitor) => {
    setEditingMonitor(monitor);
    setActiveSection('add-monitor');
  };

  const handleDeleteMonitor = (id: string) => {
    deleteMonitor(id);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === 'add-monitor') {
      setShowAddForm(true);
      setEditingMonitor(null);
    } else {
      setShowAddForm(false);
      setEditingMonitor(null);
    }
  };

  // Okunmamış incident var mı (örnek: status 'investigating' veya 'identified' olanlar)
  const hasUnreadNotifications = incidents.some(i => i.status === 'investigating' || i.status === 'identified');

  // Bildirim paneli kapandığında dışarı tıklamayı dinle
  useEffect(() => {
    if (!showNotifications) return;
    const handleClick = (e: MouseEvent) => {
      const notif = document.getElementById('notification-panel');
      if (notif && !notif.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotifications]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:3001/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } catch {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview stats={stats} statusHistory={statusHistory} monitors={monitors || []} />;
      
      case 'monitors':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Monitors</h2>
              <button
                onClick={() => handleSectionChange('add-monitor')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Monitor
              </button>
            </div>
            <MonitorList
              monitors={filteredMonitors}
              onEdit={handleEditMonitor}
              onDelete={handleDeleteMonitor}
              onPause={pauseMonitor}
              onResume={resumeMonitor}
              statusHistory={statusHistory || []}
              selectedRange={selectedRange}
            />
          </div>
        );
      
      case 'add-monitor':
        return (
          <MonitorForm
            monitor={editingMonitor ?? undefined}
            onSave={handleSaveMonitor}
            onCancel={() => {
              setEditingMonitor(null);
              setActiveSection('monitors');
            }}
          />
        );
      
      case 'incidents':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Incidents</h2>
            </div>
            <IncidentList
              incidents={incidents}
              onViewIncident={setSelectedIncident}
            />
          </div>
        );
      
      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Maintenance Windows</h2>
              <button
                onClick={() => {/* TODO: Add maintenance window */}}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Maintenance
              </button>
            </div>
            <MaintenanceList
              maintenanceWindows={maintenanceWindows}
              onEdit={(mw) => updateMaintenanceWindow(mw.id, mw)}
              onDelete={deleteMaintenanceWindow}
            />
          </div>
        );
      
      case 'certificates':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">SSL Certificates</h2>
            </div>
            <CertificateList certificates={certificates} />
          </div>
        );
      
      case 'status-page':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Status Page</h2>
              <button
                onClick={() => window.open('/status', '_blank')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Public Page
              </button>
            </div>
            <PublicStatusPage
              statusPage={statusPages[0]}
              monitors={monitors}
              incidents={incidents}
            />
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
            <NotificationSettings
              channels={notificationChannels}
              onAddChannel={addNotificationChannel}
              onUpdateChannel={updateNotificationChannel}
              onDeleteChannel={deleteNotificationChannel}
            />
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Application Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:border-transparent" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Enable dark mode</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:border-transparent" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Show response time in header</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:border-transparent" />
                    <span className="ml-2 text-sm text-gray-700">Enable sound notifications</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Data Retention</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keep monitoring data for
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="30">30 days</option>
                      <option value="90" selected>90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <DashboardOverview stats={stats} statusHistory={statusHistory} />;
    }
  };

  return (
    <Router>
      {authLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />} />
          <Route path="/profile" element={
            isAuthenticated ? (
              <Profile onLogout={() => { setIsAuthenticated(false); }} />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          <Route path="/*" element={
            isAuthenticated ? (
              <MainLayout
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                editingMonitor={editingMonitor}
                setEditingMonitor={setEditingMonitor}
                showAddForm={showAddForm}
                setShowAddForm={setShowAddForm}
                selectedIncident={selectedIncident}
                setSelectedIncident={setSelectedIncident}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                hasUnreadNotifications={hasUnreadNotifications}
                renderContent={renderContent}
                monitors={monitors}
                statusPages={statusPages}
                statusHistory={statusHistory}
                incidents={incidents}
                notificationChannels={notificationChannels}
                maintenanceWindows={maintenanceWindows}
                certificates={certificates}
                addMonitor={addMonitor}
                updateMonitor={updateMonitor}
                deleteMonitor={deleteMonitor}
                searchMonitors={searchMonitors}
                pauseMonitor={pauseMonitor}
                resumeMonitor={resumeMonitor}
                addNotificationChannel={addNotificationChannel}
                updateNotificationChannel={updateNotificationChannel}
                deleteNotificationChannel={deleteNotificationChannel}
                addMaintenanceWindow={addMaintenanceWindow}
                updateMaintenanceWindow={updateMaintenanceWindow}
                deleteMaintenanceWindow={deleteMaintenanceWindow}
                stats={stats}
                filteredMonitors={filteredMonitors}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      )}
    </Router>
  );
}

export default App;