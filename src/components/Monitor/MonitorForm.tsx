import React, { useState } from 'react';
import { Monitor } from '../../types';
import ReactSelect from 'react-select';

interface MonitorFormProps {
  monitor?: Monitor;
  onSave: (monitor: Omit<Monitor, 'id' | 'status' | 'responseTime' | 'uptime' | 'lastCheck' | 'createdAt'>) => Promise<any> | void;
  onCancel: () => void;
}

export default function MonitorForm({ monitor, onSave, onCancel }: MonitorFormProps) {
  let acceptedStatusCodesStr = '200,201,202';
  if (Array.isArray(monitor?.acceptedStatusCodes)) {
    acceptedStatusCodesStr = monitor.acceptedStatusCodes.map(val => String(val)).join(', ');
  } else if (typeof monitor?.acceptedStatusCodes === 'string') {
    acceptedStatusCodesStr = monitor.acceptedStatusCodes;
  }
  const [formData, setFormData] = useState<{
    name: string;
    url: string;
    type: string;
    interval: number;
    notifications: boolean;
    description: string;
    tags: string;
    timeout: number;
    retries: number;
    keyword: string;
    expectedStatusCode: number;
    method: string;
    headers: string;
    body: string;
    acceptedStatusCodes: string;
    ignoreTls: boolean;
    maxRedirects: number;
    port: string;
    dnsResolveType: string;
    dnsResolveServer: string;
  }>({
    name: monitor?.name || '',
    url: monitor?.url || '',
    type: monitor?.type || 'website',
    interval: monitor?.interval || 60,
    notifications: monitor?.notifications ?? true,
    description: monitor?.description || '',
    tags: monitor?.tags?.join(', ') || '',
    timeout: monitor?.timeout || 30,
    retries: monitor?.retries || 3,
    keyword: monitor?.keyword || '',
    expectedStatusCode: monitor?.expectedStatusCode || 200,
    method: monitor?.method || 'GET',
    headers: monitor?.headers ? JSON.stringify(monitor.headers, null, 2) : '',
    body: monitor?.body || '',
    acceptedStatusCodes: acceptedStatusCodesStr,
    ignoreTls: monitor?.ignoreTls || false,
    maxRedirects: monitor?.maxRedirects || 5,
    port: monitor?.port ? String(monitor.port) : '',
    dnsResolveType: monitor?.dnsResolveType || 'A',
    dnsResolveServer: monitor?.dnsResolveServer || '8.8.8.8'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusCodeOptions = [
    { value: '200', label: '200 OK' },
    { value: '201', label: '201 Created' },
    { value: '202', label: '202 Accepted' },
    { value: '204', label: '204 No Content' },
    { value: '301', label: '301 Moved Permanently' },
    { value: '302', label: '302 Found' },
    { value: '400', label: '400 Bad Request' },
    { value: '401', label: '401 Unauthorized' },
    { value: '403', label: '403 Forbidden' },
    { value: '404', label: '404 Not Found' },
    { value: '500', label: '500 Internal Server Error' },
    { value: '502', label: '502 Bad Gateway' },
    { value: '503', label: '503 Service Unavailable' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const monitorData: any = {
      name: formData.name,
      url: formData.url,
      type: formData.type,
      interval: formData.interval,
      notifications: formData.notifications,
      description: formData.description,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      timeout: formData.timeout,
      retries: formData.retries,
      expectedStatusCode: formData.expectedStatusCode,
      method: formData.method,
      acceptedStatusCodes: formData.acceptedStatusCodes.split(',').map(code => parseInt(code.trim())).filter(Boolean),
      ignoreTls: formData.ignoreTls,
      maxRedirects: formData.maxRedirects
    };
    if (formData.keyword) {
      monitorData.keyword = formData.keyword;
    }
    if (formData.headers) {
      try {
        monitorData.headers = JSON.parse(formData.headers);
      } catch (e) {
        setError('Headers alanı geçerli bir JSON olmalı.');
        setLoading(false);
        return;
      }
    }
    if (formData.body) {
      monitorData.body = formData.body;
    }
    if (formData.port) {
      monitorData.port = parseInt(formData.port);
    }
    if (formData.type === 'dns') {
      monitorData.dnsResolveType = formData.dnsResolveType;
      monitorData.dnsResolveServer = formData.dnsResolveServer;
    }
    try {
      const result = await onSave(monitorData);
      if (result && result.error) {
        setError(result.error);
      } else {
        onCancel(); // Başarıyla eklenirse formu kapat
      }
    } catch (err: any) {
      setError(err?.message || 'Monitor eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {monitor ? 'Edit Monitor' : 'Add New Monitor'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monitor Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Main Website"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monitor Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="website">Website (HTML)</option>
              <option value="api">API (Postman)</option>
              <option value="soap">SOAP</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.type === 'ping' ? 'IP Address' : 
             formData.type === 'dns' ? 'Domain Name' :
             formData.type === 'tcp' ? 'Host' : 'URL'}
          </label>
          <input
            type="text"
            required
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={
              formData.type === 'ping' ? '8.8.8.8' :
              formData.type === 'dns' ? 'example.com' :
              formData.type === 'tcp' ? 'example.com' :
              'https://example.com'
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Brief description of this monitor..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="production, critical, api"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check Interval (seconds)
            </label>
            <select
              value={String(formData.interval)}
              onChange={(e) => handleChange('interval', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="600">10 minutes</option>
              <option value="1800">30 minutes</option>
              <option value="3600">1 hour</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (seconds)
            </label>
            <input
              type="number"
              min="1"
              max="300"
              value={formData.timeout}
              onChange={(e) => handleChange('timeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retries
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={formData.retries}
              onChange={(e) => handleChange('retries', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {(formData.type === 'api' || formData.type === 'soap') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HTTP Method</label>
              <select
                value={formData.method}
                onChange={e => handleChange('method', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Headers (JSON)</label>
              <textarea
                value={formData.headers}
                onChange={e => handleChange('headers', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                rows={3}
                placeholder='{"Authorization": "Bearer ...", "Content-Type": "application/json"}'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body ({formData.type === 'soap' ? 'XML' : 'JSON'})</label>
              <textarea
                value={formData.body}
                onChange={e => handleChange('body', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                rows={5}
                placeholder={formData.type === 'soap' ? '<Envelope>...</Envelope>' : '{ "key": "value" }'}
              />
            </div>
          </>
        )}

        {formData.type === 'tcp' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port
            </label>
            <input
              type="number"
              min="1"
              max="65535"
              value={formData.port}
              onChange={(e) => handleChange('port', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="80"
            />
          </div>
        )}

        {formData.type === 'dns' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNS Record Type
              </label>
              <select
                value={formData.dnsResolveType}
                onChange={(e) => handleChange('dnsResolveType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="A">A</option>
                <option value="AAAA">AAAA</option>
                <option value="CNAME">CNAME</option>
                <option value="MX">MX</option>
                <option value="NS">NS</option>
                <option value="TXT">TXT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNS Server
              </label>
              <input
                type="text"
                value={formData.dnsResolveServer}
                onChange={(e) => handleChange('dnsResolveServer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="8.8.8.8"
              />
            </div>
          </div>
        )}

        {(formData.type === 'api' || formData.type === 'website') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accepted Status Codes
            </label>
            <ReactSelect
              isMulti
              options={statusCodeOptions}
              value={statusCodeOptions.filter(opt => formData.acceptedStatusCodes.split(',').map(s => s.trim()).includes(opt.value))}
              onChange={selected => {
                const values = Array.isArray(selected) ? selected.map(opt => opt.value) : [];
                handleChange('acceptedStatusCodes', values.join(','));
              }}
              classNamePrefix="react-select"
              placeholder="Select status codes..."
            />
          </div>
        )}

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="notifications"
            checked={formData.notifications}
            onChange={(e) => handleChange('notifications', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="notifications" className="text-sm font-medium text-gray-700">
            Enable notifications
          </label>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : monitor ? 'Update Monitor' : 'Create Monitor'}
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}