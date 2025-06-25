import React, { useState } from 'react';
import { NotificationChannel } from '../../types';
import { Plus, Mail, MessageSquare, Smartphone, Webhook, Trash2, Settings } from 'lucide-react';

interface NotificationSettingsProps {
  channels: NotificationChannel[];
  onAddChannel: (channel: Omit<NotificationChannel, 'id' | 'createdAt'>) => void;
  onUpdateChannel: (id: string, updates: Partial<NotificationChannel>) => void;
  onDeleteChannel: (id: string) => void;
}

export default function NotificationSettings({ 
  channels, 
  onAddChannel, 
  onUpdateChannel, 
  onDeleteChannel 
}: NotificationSettingsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    type: 'email' as const,
    config: {},
    enabled: true
  });

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'slack': return <MessageSquare className="w-4 h-4" />;
      case 'discord': return <MessageSquare className="w-4 h-4" />;
      case 'webhook': return <Webhook className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChannel(newChannel);
    setNewChannel({ name: '', type: 'email', config: {}, enabled: true });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Notification Channels</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Channel
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">Add Notification Channel</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  required
                  value={newChannel.name}
                  onChange={(e) => setNewChannel(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Team Email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Type
                </label>
                <select
                  value={newChannel.type}
                  onChange={(e) => setNewChannel(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                  <option value="discord">Discord</option>
                  <option value="webhook">Webhook</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Channel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {channels.map((channel) => (
          <div key={channel.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getChannelIcon(channel.type)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{channel.name}</h4>
                  <p className="text-sm text-gray-500 capitalize">{channel.type}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={channel.enabled}
                    onChange={(e) => onUpdateChannel(channel.id, { enabled: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enabled</span>
                </label>
                
                <button
                  onClick={() => onDeleteChannel(channel.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {channels.length === 0 && !showAddForm && (
        <div className="text-center py-8">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notification channels configured</h3>
          <p className="text-gray-500 mb-4">Add notification channels to receive alerts when monitors go down.</p>
        </div>
      )}
    </div>
  );
}