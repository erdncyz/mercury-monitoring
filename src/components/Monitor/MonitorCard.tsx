import { Monitor } from '../../types';
import StatusBadge from '../UI/StatusBadge';
import { Clock, TrendingUp, Settings, ExternalLink, Play, Pause } from 'lucide-react';

interface MonitorCardProps {
  monitor: Monitor;
  onEdit: (monitor: Monitor) => void;
  onDelete: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  statusHistory: any[];
  selectedRange: number;
}

export default function MonitorCard({ monitor, onEdit, onDelete, onPause, onResume, statusHistory, selectedRange }: MonitorCardProps) {
  const formatLastCheck = (date?: string | Date | null) => {
    if (!date) return '—';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return '—';
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatCreatedAt = (date?: string | Date | null) => {
    if (!date) return '—';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return '—';
    return d.toLocaleDateString();
  };

  // Dinamik uptime hesaplama
  const now = new Date();
  const from = new Date(now.getTime() - selectedRange * 24 * 60 * 60 * 1000);
  const relevantHistory = statusHistory.filter(item => new Date(item.timestamp) >= from);
  const upCount = relevantHistory.filter(item => item.status === 'up').length;
  const totalCount = relevantHistory.length;
  const uptime = totalCount > 0 ? `${Math.round((upCount / totalCount) * 10000) / 100}%` : 'N/A';

  // Status ve LastCheck için fallback'ler
  const status = monitor.lastStatus || monitor.status || 'Unknown';
  const lastCheck = monitor.lastChecked || null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{monitor.name}</h3>
              <StatusBadge status={status} showPulse={status === 'up'} />
              {monitor.tags && monitor.tags.length > 0 && (
                <div className="flex space-x-1">
                  {monitor.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {monitor.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{monitor.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{monitor.url}</p>
            {monitor.description && (
              <p className="text-sm text-gray-500">{monitor.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {monitor.status === 'paused' ? (
              <button
                onClick={() => onResume(monitor.id)}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Resume monitoring"
              >
                <Play className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onPause(monitor.id)}
                className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                title="Pause monitoring"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onEdit(monitor)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <a
              href={monitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Response Time</p>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900">
                {monitor.responseTime > 0 ? `${monitor.responseTime}ms` : 'N/A'}
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-gray-500 mb-1">Uptime</p>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-green-600">{uptime}</span>
            </div>
          </div>
          
          <div>
            <p className="text-gray-500 mb-1">Check Interval</p>
            <span className="font-medium text-gray-900">{monitor.interval}s</span>
          </div>
          
          <div>
            <p className="text-gray-500 mb-1">Last Check</p>
            <span className="font-medium text-gray-900">{formatLastCheck(lastCheck)}</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Type: {monitor.type.toUpperCase()} • 
            Created: {formatCreatedAt(monitor.createdAt)}
          </span>
          <div className="flex items-center space-x-2">
            {monitor.notifications && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Notifications ON
              </span>
            )}
            <button
              onClick={() => onDelete(monitor.id)}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}