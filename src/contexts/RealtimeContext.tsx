import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';
import { useBike } from './BikeContext';
import { sampleRealtimePayload } from '../data/mockData';
import { fetchLatestTelemetry } from '../services/api';

export type RealtimePayload = typeof sampleRealtimePayload;

type RealtimeContextValue = {
  payload: RealtimePayload;
  setPayload: (payload: RealtimePayload) => void;
  loading: boolean;
};

const RealtimeContext = createContext<RealtimeContextValue | undefined>(
  undefined
);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { activeBike } = useBike();
  const [payload, setPayload] = useState(sampleRealtimePayload);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!activeBike?.id) return;
    const hydrate = async () => {
      try {
        setLoading(true);
        const latest = await fetchLatestTelemetry(activeBike.id);
        if (!isMounted || !latest) return;
        setPayload((prev) => ({
          gps: latest.gps
            ? {
                lat: latest.gps.lat,
                lng: latest.gps.lng,
                speed: latest.gps.speed_kmh,
                heading: latest.gps.heading_deg,
              }
            : prev.gps,
          battery: latest.battery
            ? {
                soc: latest.battery.soc,
                voltage: latest.battery.voltage,
                current: latest.battery.current,
                temperature: latest.battery.temperature,
                health: latest.battery.health,
              }
            : prev.battery,
          relay: latest.relay ?? prev.relay,
          alerts: latest.alerts?.length ? latest.alerts : prev.alerts,
        }));
      } catch (error) {
        console.warn('Failed to hydrate realtime payload', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    hydrate();
    return () => {
      isMounted = false;
    };
  }, [activeBike?.id]);

  useEffect(() => {
    if (!hasSupabaseConfig || !activeBike?.id) return;
    const channel = supabase
      .channel(`bike-stream-${activeBike.id}`, {
        config: {
          broadcast: { ack: false },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gps_data',
          filter: `bike_id=eq.${activeBike.id}`,
        },
        (payloadEvent) => {
          setPayload((prev) => ({
            ...prev,
            gps: {
              lat: payloadEvent.new.lat,
              lng: payloadEvent.new.lng,
              speed: payloadEvent.new.speed_kmh,
              heading: payloadEvent.new.heading_deg,
            },
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'relay_commands',
          filter: `bike_id=eq.${activeBike.id}`,
        },
        (payloadEvent) => {
          setPayload((prev) => {
            switch (payloadEvent.new.command) {
              case 'IGNITION_ON':
                return { ...prev, relay: { ...prev.relay, ignition: true } };
              case 'IGNITION_OFF':
                return { ...prev, relay: { ...prev.relay, ignition: false } };
              case 'IMMOBILIZE':
                return {
                  ...prev,
                  relay: { ...prev.relay, immobilized: true },
                };
              case 'UNLOCK':
                return {
                  ...prev,
                  relay: { ...prev.relay, immobilized: false },
                };
              default:
                return prev;
            }
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bms_data',
          filter: `bike_id=eq.${activeBike.id}`,
        },
        (payloadEvent) => {
          setPayload((prev) => ({
            ...prev,
            battery: {
              soc: payloadEvent.new.soc,
              voltage: payloadEvent.new.voltage,
              current: payloadEvent.new.current,
              temperature: payloadEvent.new.temperature,
              health: payloadEvent.new.health,
            },
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `bike_id=eq.${activeBike.id}`,
        },
        (payloadEvent) => {
          setPayload((prev) => ({
            ...prev,
            alerts: [
              {
                id: payloadEvent.new.id,
                type: payloadEvent.new.type,
                message: payloadEvent.new.message,
                timestamp: payloadEvent.new.created_at,
              },
              ...prev.alerts,
            ].slice(0, 5),
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeBike?.id]);

  const value = useMemo(
    () => ({ payload, setPayload, loading }),
    [payload, loading]
  );

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
}
