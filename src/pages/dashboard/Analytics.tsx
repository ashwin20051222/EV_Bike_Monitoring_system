import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../../components/ui/Card';

const batteryTrend = [
  { day: 'Mon', soc: 82, health: 93 },
  { day: 'Tue', soc: 74, health: 92 },
  { day: 'Wed', soc: 68, health: 92 },
  { day: 'Thu', soc: 80, health: 91 },
  { day: 'Fri', soc: 77, health: 91 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Predictive analytics
        </p>
        <h2 className="text-2xl font-semibold">Battery health outlook</h2>
        <p className="text-sm text-slate-500">
          Machine learning forecasts based on temperature, charge cycles and
          usage.
        </p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={batteryTrend}>
              <defs>
                <linearGradient id="soc" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="soc"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#soc)"
              />
              <Area
                type="monotone"
                dataKey="health"
                stroke="#0ea5e9"
                fillOpacity={0.2}
                fill="#0ea5e9"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Charge optimization',
            detail: 'Next charge at 24% to extend battery life by 12%.',
          },
          {
            title: 'Temperature impact',
            detail: 'Recent high temps add +1.8% degradation risk.',
          },
          {
            title: 'Maintenance forecast',
            detail: 'Suggest service in 320km to inspect brake pads.',
          },
        ].map((item) => (
          <Card key={item.title} className="p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Insight
            </p>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-slate-500">{item.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

