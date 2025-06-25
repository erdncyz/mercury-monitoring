import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusHistory } from '../../types';
import { format, subMinutes, subHours } from 'date-fns';

interface ResponseTimeChartProps {
  data: StatusHistory[];
  days?: number;
}

const ranges = [
  { label: '1 dk', value: 1 },
  { label: '5 dk', value: 5 },
  { label: '1 saat', value: 60 },
  { label: '24 saat', value: 60 * 24 },
];

export default function ResponseTimeChart({ data, days = 1 }: ResponseTimeChartProps) {
  const [minutes, setMinutes] = useState(60 * 24); // Varsayılan 24 saat
  const now = new Date();
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  });
  const chartData = filteredData.map(item => ({
    time: format(item.timestamp, 'HH:mm'),
    responseTime: item.responseTime,
    status: item.status
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Response Time</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`${value}ms`, 'Response Time']}
          />
          <Line 
            type="monotone" 
            dataKey="responseTime" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}