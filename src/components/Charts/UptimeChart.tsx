import React, { useState } from 'react';
import { StatusHistory } from '../../types';
import { format, subDays, formatDistanceToNow, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

interface UptimeChartProps {
  data: StatusHistory[];
  days?: number;
}

const ranges = [
  { label: '1 gün', value: 1 },
  { label: '7 gün', value: 7 },
  { label: '30 gün', value: 30 },
  { label: '90 gün', value: 90 },
];

export default function UptimeChart({ data, days = 90 }: UptimeChartProps) {
  const now = new Date();
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  });

  const generateDays = () => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayData = filteredData.filter(item =>
        format(item.timestamp, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      const upCount = dayData.filter(item => item.status === 'up').length;
      const totalCount = dayData.length;
      const uptime = totalCount > 0 ? (upCount / totalCount) * 100 : 100;
      result.push({
        date: format(date, 'MMM dd'),
        uptime: Number(uptime.toFixed(2)),
      });
    }
    return result;
  };

  const chartData = generateDays();

  // İnsan dostu zaman etiketi
  let timeAgoLabel = '';
  if (days < 1) {
    const minutes = Math.round(days * 24 * 60);
    timeAgoLabel = minutes <= 60 ? `${minutes} minutes ago` : `${Math.round(days * 24)} hours ago`;
  } else {
    timeAgoLabel = `${days} days ago`;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.15"/><circle cx="12" cy="12" r="6" fill="#22c55e"/></svg>
          Uptime History
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[90, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={v => `${v}% uptime`} labelFormatter={l => `Date: ${l}`} />
          <Area type="monotone" dataKey="uptime" stroke="#22c55e" fillOpacity={1} fill="url(#colorUptime)" strokeWidth={2} dot={{ r: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{timeAgoLabel}</span>
        <span>Today</span>
      </div>
    </div>
  );
}