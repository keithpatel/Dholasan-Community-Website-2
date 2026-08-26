
import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color?: string;
  onClick?: () => void;
  badge?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, onClick, badge }) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-sm font-semibold">
          {icon}
        </div>
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;

