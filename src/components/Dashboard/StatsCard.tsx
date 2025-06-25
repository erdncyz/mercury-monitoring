import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'amber' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    gray: 'bg-gray-50 text-gray-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 flex items-center ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span className={`mr-1 ${trend.isPositive ? '↗' : '↘'}`}>
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}