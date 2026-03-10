import { Card } from '../../components/ui/Card';

export function Environment() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Sustainability
        </p>
        <h2 className="text-2xl font-semibold">Impact dashboard</h2>
        <p className="text-sm text-slate-500">
          Showcase how much CO₂ the rider avoided and how much energy they
          saved vs petrol.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: 'CO₂ avoided', value: '142 kg' },
            { label: 'Energy saved', value: '214 kWh' },
            { label: 'Cost savings', value: '₹ 7.8k' },
          ].map((item) => (
            <Card key={item.label} className="p-4 text-center">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {item.label}
              </p>
              <p className="text-2xl font-semibold">{item.value}</p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

