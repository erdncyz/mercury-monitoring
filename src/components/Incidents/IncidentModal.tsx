import React from 'react';
import { Incident } from '../../types';
import { X, AlertTriangle, Clock, CheckCircle, Eye } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface IncidentModalProps {
  incident: Incident;
  onClose: () => void;
}

export default function IncidentModal({ incident, onClose }: IncidentModalProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'major': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'minor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Incident Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                {incident.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{incident.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Monitor:</span>
                <span className="ml-2 font-medium">{incident.monitorName}</span>
              </div>
              <div>
                <span className="text-gray-500">Started:</span>
                <span className="ml-2 font-medium">{format(incident.startTime, 'MMM dd, yyyy HH:mm')}</span>
              </div>
              {incident.endTime && (
                <div>
                  <span className="text-gray-500">Ended:</span>
                  <span className="ml-2 font-medium">{format(incident.endTime, 'MMM dd, yyyy HH:mm')}</span>
                </div>
              )}
              {incident.duration && (
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 font-medium">{Math.floor(incident.duration / (1000 * 60))} minutes</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Incident Timeline</h4>
            <div className="space-y-4">
              {incident.updates.map((update, index) => (
                <div key={update.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(update.status)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(update.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{update.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(update.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}