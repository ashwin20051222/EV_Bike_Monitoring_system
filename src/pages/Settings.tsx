import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Preferences
        </p>
        <h2 className="text-2xl font-semibold">Experience settings</h2>
        <p className="text-sm text-slate-500">
          Update theme, notifications and privacy controls.
        </p>
      </Card>
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Theme mode</p>
            <p className="text-xs text-slate-500">Currently {theme}</p>
          </div>
          <Button onClick={toggleTheme}>Toggle theme</Button>
        </div>
      </Card>
    </div>
  );
}

