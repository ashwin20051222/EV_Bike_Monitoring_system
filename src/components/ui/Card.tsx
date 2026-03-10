import { HTMLAttributes } from 'react';
import clsx from 'clsx';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  elevate?: boolean;
};

export function Card({ className, elevate = true, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-100/70 dark:border-white/5 bg-white/90 dark:bg-slate-900/80',
        elevate && 'shadow-xl shadow-black/5 dark:shadow-none',
        className
      )}
      {...props}
    />
  );
}

