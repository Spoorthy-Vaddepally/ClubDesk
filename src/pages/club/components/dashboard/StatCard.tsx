import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  color
}) => {
  const getColorClasses = () => {
    const colorMap = {
      primary: {
        light: 'bg-primary-50',
        icon: 'bg-primary-100 text-primary-600',
        changePositive: 'text-primary-700',
        changeNegative: 'text-red-700',
      },
      secondary: {
        light: 'bg-secondary-50',
        icon: 'bg-secondary-100 text-secondary-600',
        changePositive: 'text-secondary-700',
        changeNegative: 'text-red-700',
      },
      accent: {
        light: 'bg-accent-50',
        icon: 'bg-accent-100 text-accent-600',
        changePositive: 'text-accent-700',
        changeNegative: 'text-red-700',
      },
      success: {
        light: 'bg-green-50',
        icon: 'bg-green-100 text-green-600',
        changePositive: 'text-green-700',
        changeNegative: 'text-red-700',
      },
      warning: {
        light: 'bg-amber-50',
        icon: 'bg-amber-100 text-amber-600',
        changePositive: 'text-amber-700',
        changeNegative: 'text-red-700',
      },
    };
    
    return colorMap[color];
  };
  
  const colors = getColorClasses();
  
  return (
    <div className="card h-full">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colors.icon} mr-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {(change !== undefined) && (
          <div className="mt-1 flex items-center">
            <span className={change >= 0 ? colors.changePositive : colors.changeNegative}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            {changeLabel && (
              <span className="ml-2 text-sm text-gray-500">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;