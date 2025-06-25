import React from 'react';
import { Monitor } from '../../types';

interface StatusBadgeProps {
  status: Monitor['status'];
  showPulse?: boolean;
}

export default function StatusBadge({ status, showPulse = false }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'up':
        return {
          color: 'bg-green-100 text-green-800',
          dot: 'bg-green-500',
          label: 'Up'
        };
      case 'down':
        return {
          color: 'bg-red-100 text-red-800',
          dot: 'bg-red-500',
          label: 'Down'
        };
      case 'maintenance':
        return {
          color: 'bg-amber-100 text-amber-800',
          dot: 'bg-amber-500',
          label: 'Maintenance'
        };
      case 'pending':
        return {
          color: 'bg-gray-100 text-gray-800',
          dot: 'bg-gray-500',
          label: 'Pending'
        };
      case 'paused':
        return {
          color: 'bg-blue-100 text-blue-800',
          dot: 'bg-blue-500',
          label: 'Paused'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          dot: 'bg-gray-500',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span className={`w-2 h-2 rounded-full mr-1.5 ${config.dot} ${showPulse && status === 'up' ? 'animate-pulse' : ''}`}></span>
      {config.label}
    </span>
  );
}