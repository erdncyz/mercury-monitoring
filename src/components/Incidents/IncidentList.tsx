import React from 'react';
import { Incident } from '../../types';
import { AlertTriangle, Clock, CheckCircle, Eye } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface IncidentListProps {
  incidents: Incident[];
  onViewIncident: (incident: Incident) => void;
}

export default function IncidentList({ incidents, onViewIncident }: IncidentListProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'major': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'minor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-blue-100 text-blue-800';
      case 'identified': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'monitoring': return <Eye className="w-4 h-4" />;
      case 'identified': return <AlertTriangle className="w-4 h-4" />;
      case 'investigating': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (incidents.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No incidents reported</h3>
        <p className="text-gray-500">All systems are operating normally.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div key={incident.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                  {incident.severity.toUpperCase()}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                  {getStatusIcon(incident.status)}
                  <span className="ml-1">{incident.status.toUpperCase()}</span>
                </span>
              </div>
              <p className="text-gray-600 mb-2">{incident.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Monitor: {incident.monitorName}</span>
                <span>Started: {formatDistanceToNow(incident.startTime, { addSuffix: true })}</span>
                {incident.duration && (
                  <span>Duration: {Math.floor(incident.duration / (1000 * 60))} minutes</span>
                )}
              </div>
            </div>
            <button
              onClick={() => onViewIncident(incident)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View Details
            </button>
          </div>

          {incident.updates.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Latest Update</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 mb-2">{incident.updates[incident.updates.length - 1].message}</p>
                <p className="text-xs text-gray-500">
                  {format(incident.updates[incident.updates.length - 1].timestamp, 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}