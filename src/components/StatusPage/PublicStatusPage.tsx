import { Monitor, Incident, StatusPage } from '../../types';
import StatusBadge from '../UI/StatusBadge';
import { format } from 'date-fns';
import { Globe } from 'lucide-react';

interface PublicStatusPageProps {
  statusPage: StatusPage;
  monitors: Monitor[];
  incidents: Incident[];
}

export default function PublicStatusPage({ statusPage, monitors, incidents }: PublicStatusPageProps) {
  const filteredMonitors = monitors.filter(m => statusPage.monitors.includes(m.id));
  const filteredIncidents = incidents.filter(i => statusPage.incidents.includes(i.id));
  
  const overallStatus = filteredMonitors.every(m => m.status === 'up') ? 'operational' : 
                       filteredMonitors.some(m => m.status === 'down') ? 'major-outage' : 'partial-outage';

  const getOverallStatusConfig = () => {
    switch (overallStatus) {
      case 'operational':
        return {
          color: 'bg-green-100 text-green-800',
          dot: 'bg-green-500',
          label: 'All Systems Operational'
        };
      case 'partial-outage':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          dot: 'bg-yellow-500',
          label: 'Partial System Outage'
        };
      case 'major-outage':
        return {
          color: 'bg-red-100 text-red-800',
          dot: 'bg-red-500',
          label: 'Major System Outage'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          dot: 'bg-gray-500',
          label: 'Unknown Status'
        };
    }
  };

  const statusConfig = getOverallStatusConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl text-blue-600 font-bold">☿</span>
            <Globe className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{statusPage.name}</h1>
          </div>
          <p className="text-gray-600 mb-6">{statusPage.description}</p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${statusConfig.color}`}>
            <span className={`w-3 h-3 rounded-full mr-2 ${statusConfig.dot} ${overallStatus === 'operational' ? 'animate-pulse' : ''}`}></span>
            {statusConfig.label}
          </div>
        </div>

        {/* Current Incidents */}
        {filteredIncidents.filter(i => i.status !== 'resolved').length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Incidents</h2>
            <div className="space-y-4">
              {filteredIncidents.filter(i => i.status !== 'resolved').map((incident) => (
                <div key={incident.id} className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{incident.title}</h3>
                    <span className="text-sm text-gray-500">
                      {format(incident.startTime, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                  {incident.updates.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Latest: {incident.updates[incident.updates.length - 1].message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Services</h2>
          <div className="space-y-4">
            {filteredMonitors.map((monitor) => (
              <div key={monitor.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{monitor.name}</h3>
                    {monitor.description && (
                      <p className="text-sm text-gray-500">{monitor.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {monitor.status === 'up' && monitor.responseTime > 0 && (
                    <span className="text-sm text-gray-500">{monitor.responseTime}ms</span>
                  )}
                  <StatusBadge status={monitor.status} showPulse={monitor.status === 'up'} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        {filteredIncidents.filter(i => i.status === 'resolved').length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Incidents</h2>
            <div className="space-y-4">
              {filteredIncidents.filter(i => i.status === 'resolved').slice(0, 5).map((incident) => (
                <div key={incident.id} className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{incident.title}</h3>
                    <span className="text-sm text-gray-500">
                      {format(incident.startTime, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Resolved</span>
                    {incident.duration && (
                      <span>Duration: {Math.floor(incident.duration / (1000 * 60))} minutes</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {statusPage.showPoweredBy && (
          <div className="text-center text-sm text-gray-500">
            <p>Powered by Mercury Monitoring</p>
          </div>
        )}
      </div>
    </div>
  );
}