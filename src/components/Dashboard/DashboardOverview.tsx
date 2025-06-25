import React, { useState } from 'react';
import type { Monitor } from '../../types';
import { Activity, Clock, TrendingUp, AlertTriangle, Pause, Settings } from 'lucide-react';
import StatsCard from './StatsCard';
import ResponseTimeChart from '../Charts/ResponseTimeChart';
import UptimeChart from '../Charts/UptimeChart';
import { DashboardStats, StatusHistory } from '../../types';

interface DashboardOverviewProps {
  stats: DashboardStats;
  statusHistory: StatusHistory[];
  monitors: Monitor[];
}

export default function DashboardOverview({ stats, statusHistory, monitors }: DashboardOverviewProps) {
  const [selectedMonitorId, setSelectedMonitorId] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<number>(1/24); // default 1 saat

  // Ortak zaman aralığı seçenekleri
  const ranges = [
    { label: '1 saat', value: 1/24 },
    { label: '6 saat', value: 6/24 },
    { label: '12 saat', value: 12/24 },
    { label: '1 gün', value: 1 },
    { label: '7 gün', value: 7 },
    { label: '30 gün', value: 30 },
    { label: '90 gün', value: 90 },
  ];

  // Dropdown için monitör seçenekleri
  const monitorOptions = [
    { label: 'Tümü', value: 'all' },
    ...monitors.map((m: any) => ({ label: m.name, value: String(m.id) }))
  ];

  // Seçili monitöre göre statusHistory'yi filtrele
  const filteredStatusHistory = selectedMonitorId === 'all'
    ? statusHistory
    : statusHistory.filter(s => String(s.monitorId) === String(selectedMonitorId));

  // Dinamik overall uptime hesaplama (seçili zaman aralığı ve monitör filtresine göre)
  const now = new Date();
  const from = new Date(now.getTime() - selectedRange * 24 * 60 * 60 * 1000);
  const relevantHistory = filteredStatusHistory.filter(item => new Date(item.timestamp) >= from);
  const upCount = relevantHistory.filter(item => item.status === 'up').length;
  const totalCount = relevantHistory.length;
  const overallUptime = totalCount > 0 ? Math.round((upCount / totalCount) * 10000) / 100 : 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Monitors"
            value={stats.totalMonitors}
            icon={Activity}
            color="blue"
            trend={stats.trends?.totalMonitors}
          />
          <StatsCard
            title="Services Up"
            value={stats.upMonitors}
            icon={Activity}
            color="green"
            trend={stats.trends?.upMonitors}
          />
          <StatsCard
            title="Services Down"
            value={stats.downMonitors}
            icon={Activity}
            color="red"
            trend={stats.trends?.downMonitors}
          />
          <StatsCard
            title="Avg Response Time"
            value={`${stats.averageResponseTime}ms`}
            icon={Clock}
            color="amber"
            trend={stats.trends?.averageResponseTime}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Maintenance"
          value={stats.maintenanceMonitors}
          icon={Settings}
          color="amber"
        />
        <StatsCard
          title="Paused"
          value={stats.pausedMonitors}
          icon={Pause}
          color="gray"
        />
        <StatsCard
          title="Total Checks"
          value={stats.totalChecks.toLocaleString()}
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          title="Incidents Today"
          value={stats.incidentsToday}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            All Systems Operational
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-gray-700">Overall Uptime</span>
            <span className="text-sm font-semibold text-green-600">{overallUptime}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallUptime}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Monitör seçici ve grafikler */}
      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        {/* Response Time Card */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-700">Monitor Seç</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedMonitorId}
                onChange={e => setSelectedMonitorId(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400"
                style={{ minWidth: 160 }}
              >
                {monitorOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={selectedRange}
                onChange={e => setSelectedRange(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400"
                style={{ minWidth: 100 }}
              >
                {ranges.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {filteredStatusHistory && filteredStatusHistory.length > 0 ? (
              <ResponseTimeChart data={filteredStatusHistory} days={selectedRange} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Veri yok.</span>
              </div>
            )}
          </div>
        </div>
        {/* Uptime History Card */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <span className="opacity-0">Monitor Seç</span>
            <span className="opacity-0">
              <select className="invisible" style={{ minWidth: 160 }}><option>Tümü</option></select>
              <select className="invisible" style={{ minWidth: 100 }}><option>1 gün</option></select>
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {filteredStatusHistory && filteredStatusHistory.length > 0 ? (
              <UptimeChart data={filteredStatusHistory} days={selectedRange} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Veri yok.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}