import { ReactNode } from 'react';
import { Card } from '../ui/Card';

type StatTileProps = {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
};

export function StatTile({ label, value, subtext, icon }: StatTileProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="rounded-2xl bg-primary-500/10 p-3 text-primary-500">
            {icon}
          </div>
        )}
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {label}
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

