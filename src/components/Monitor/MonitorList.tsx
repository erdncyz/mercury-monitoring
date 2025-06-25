import React, { useState } from 'react';
import { Monitor } from '../../types';
import MonitorCard from './MonitorCard';
import ConfirmModal from '../UI/ConfirmModal';

interface MonitorListProps {
  monitors: Monitor[];
  onEdit: (monitor: Monitor) => void;
  onDelete: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  statusHistory: any[];
  selectedRange: number;
}

export default function MonitorList({ monitors, onEdit, onDelete, onPause, onResume, statusHistory, selectedRange }: MonitorListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (monitors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No monitors found</h3>
        <p className="text-gray-500">Get started by adding your first monitor to track website uptime.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {monitors.map((monitor) => (
          <MonitorCard
            key={monitor.id}
            monitor={monitor}
            onEdit={onEdit}
            onDelete={() => setDeleteId(monitor.id)}
            onPause={onPause}
            onResume={onResume}
            statusHistory={statusHistory.filter(h => String(h.monitorId) === String(monitor.id))}
            selectedRange={selectedRange}
          />
        ))}
      </div>
      <ConfirmModal
        open={!!deleteId}
        title="Monitor Sil"
        description="Bu monitorü silmek istediğinize emin misiniz?"
        confirmText="Sil"
        cancelText="Vazgeç"
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}