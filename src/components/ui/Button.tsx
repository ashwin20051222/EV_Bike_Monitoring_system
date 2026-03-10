import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline';
  fullWidth?: boolean;
};

export function Button({
  className,
  variant = 'primary',
  fullWidth,
  ...props
}: ButtonProps) {
  const classes = clsx(
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
    {
      'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/30':
        variant === 'primary',
      'bg-transparent text-slate-900 dark:text-white hover:bg-slate-200/40 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10':
        variant === 'outline',
      'bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white':
        variant === 'ghost',
      'w-full': fullWidth,
    },
    className
  );

  return <button className={classes} {...props} />;
}

