import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Bike as BikeRecord } from '../types/domain';
import { bikes as mockBikes } from '../data/mockData';
import { fetchBikes } from '../services/api';

export type Bike = {
  id: string;
  name: string;
  vin: string;
  batteryCapacity: number;
  raw?: BikeRecord;
};

type BikeContextValue = {
  bikes: Bike[];
  activeBike: Bike;
  setActiveBike: (bikeId: string) => void;
  refreshing: boolean;
  refresh: () => Promise<void>;
};

const BikeContext = createContext<BikeContextValue | undefined>(undefined);

function mapBike(record: BikeRecord): Bike {
  return {
    id: record.id,
    name: record.name,
    vin: record.vin,
    batteryCapacity: record.battery_capacity_kwh,
    raw: record,
  };
}

export function BikeProvider({ children }: { children: ReactNode }) {
  const [bikes, setBikes] = useState<Bike[]>(
    mockBikes.map((bike) => ({
      id: bike.id,
      name: bike.name,
      vin: bike.vin,
      batteryCapacity: bike.batteryCapacity,
    }))
  );
  const [activeBikeId, setActiveBikeId] = useState(bikes[0]?.id ?? '');
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const records = await fetchBikes();
      if (!records.length) return;
      const mapped = records.map(mapBike);
      setBikes(mapped);
      setActiveBikeId((current) => current || mapped[0].id);
    } catch (error) {
      console.warn('Falling back to mock bikes', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const activeBike = useMemo(
    () => bikes.find((bike) => bike.id === activeBikeId) ?? bikes[0],
    [activeBikeId, bikes]
  );

  const value = useMemo(
    () => ({
      bikes,
      activeBike,
      setActiveBike: setActiveBikeId,
      refreshing,
      refresh,
    }),
    [activeBike, bikes, refreshing]
  );

  return <BikeContext.Provider value={value}>{children}</BikeContext.Provider>;
}

export function useBike() {
  const context = useContext(BikeContext);
  if (!context) {
    throw new Error('useBike must be used within BikeProvider');
  }
  return context;
}
