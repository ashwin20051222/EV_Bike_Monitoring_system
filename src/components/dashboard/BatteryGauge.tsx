type BatteryGaugeProps = {
  value: number;
  label: string;
  subtitle?: string;
};

export function BatteryGauge({ value, label, subtitle }: BatteryGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100/70 bg-white/70 p-6 text-center dark:border-white/5 dark:bg-slate-900/70">
      <div className="relative h-28 w-28 rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="absolute inset-0 rounded-full border-8 border-transparent"
          style={{
            background: `conic-gradient(#3b82f6 ${clamped * 3.6}deg, #e2e8f0 0deg)`,
          }}
        />
        <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
          <span className="text-2xl font-semibold">{clamped}%</span>
          <span className="text-xs uppercase tracking-wide text-slate-400">
            SoC
          </span>
        </div>
      </div>
      <p className="text-sm font-medium">{label}</p>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}

