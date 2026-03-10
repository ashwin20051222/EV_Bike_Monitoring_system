import { useState } from 'react';
import { Card } from '../ui/Card';
import { useRealtime } from '../../contexts/RealtimeContext';
import { useBike } from '../../contexts/BikeContext';
import { sendRelayCommand } from '../../services/api';
import { hasSupabaseConfig } from '../../lib/supabaseClient';

export function RelayToggle() {
  const { payload, setPayload } = useRealtime();
  const { activeBike } = useBike();
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);

  const ignition = payload.relay.ignition;
  const immobilized = payload.relay.immobilized;

  const handleCommand = async (command: 'IGNITION_ON' | 'IGNITION_OFF' | 'IMMOBILIZE' | 'UNLOCK') => {
    if (!activeBike?.id) return;
    setPendingCommand(command);
    try {
      await sendRelayCommand({ bikeId: activeBike.id, command });
      if (!hasSupabaseConfig) {
        setPayload((prev) => {
          switch (command) {
            case 'IGNITION_ON':
              return { ...prev, relay: { ...prev.relay, ignition: true } };
            case 'IGNITION_OFF':
              return { ...prev, relay: { ...prev.relay, ignition: false } };
            case 'IMMOBILIZE':
              return { ...prev, relay: { ...prev.relay, immobilized: true } };
            case 'UNLOCK':
              return { ...prev, relay: { ...prev.relay, immobilized: false } };
            default:
              return prev;
          }
        });
      }
    } catch (error) {
      console.error('Relay command failed', error);
    } finally {
      setPendingCommand(null);
    }
  };

  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-widest text-slate-400">
        Remote control
      </p>
      <div className="mt-4 space-y-4">
        <label className="flex items-center justify-between rounded-2xl border border-slate-100/70 p-4 dark:border-white/5">
          <div>
            <p className="font-semibold">Ignition / Power</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Toggle to remotely start or stop the bike.
            </p>
          </div>
          <button
            className={`relative h-7 w-14 rounded-full transition ${
              ignition
                ? 'bg-emerald-400'
                : 'bg-slate-200 dark:bg-slate-700'
            } ${pendingCommand ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={() =>
              handleCommand(ignition ? 'IGNITION_OFF' : 'IGNITION_ON')
            }
            disabled={Boolean(pendingCommand)}
          >
            <span
              className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition ${
                ignition ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </label>

        <label className="flex items-center justify-between rounded-2xl border border-slate-100/70 p-4 dark:border-white/5">
          <div>
            <p className="font-semibold">Immobilize bike</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prevent unauthorized movement immediately.
            </p>
          </div>
          <button
            className={`relative h-7 w-14 rounded-full transition ${
              immobilized ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-700'
            } ${pendingCommand ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={() => handleCommand(immobilized ? 'UNLOCK' : 'IMMOBILIZE')}
            disabled={Boolean(pendingCommand)}
          >
            <span
              className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition ${
                immobilized ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
      </div>
    </Card>
  );
}

