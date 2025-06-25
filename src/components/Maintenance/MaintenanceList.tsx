import React from 'react';
import { MaintenanceWindow } from '../../types';
import { Calendar, Clock, Settings, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface MaintenanceListProps {
  maintenanceWindows: MaintenanceWindow[];
  onEdit: (maintenance: MaintenanceWindow) => void;
  onDelete: (id: string) => void;
}

export default function MaintenanceList({ maintenanceWindows, onEdit, onDelete }: MaintenanceListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (maintenanceWindows.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance scheduled</h3>
        <p className="text-gray-500">Schedule maintenance windows to notify users of planned downtime.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {maintenanceWindows.map((maintenance) => (
        <div key={maintenance.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{maintenance.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(maintenance.status)}`}>
                  {maintenance.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{maintenance.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Start Time</p>
                    <p className="font-medium">{format(maintenance.startTime, 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">End Time</p>
                    <p className="font-medium">{format(maintenance.endTime, 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">
                    {Math.floor((maintenance.endTime.getTime() - maintenance.startTime.getTime()) / (1000 * 60))} minutes
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Affected monitors: {maintenance.monitors.length} monitor(s)
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(maintenance)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(maintenance.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}