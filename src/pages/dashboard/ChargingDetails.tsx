import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import FloatingPanel from '../../components/layout/FloatingPanel';

interface ChargingSession {
  id: string;
  startTime: string;
  endTime: string;
  startBattery: number;
  endBattery: number;
  charger: string;
  energyAdded: number;
}

export const ChargingPage: React.FC = () => {
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSOC, setCurrentSOC] = useState(45);
  useEffect(() => {
    // Simulate loading charging data
    setTimeout(() => {
      setSessions([
        {
          id: 'c1',
          startTime: new Date(Date.now() - 86400000).toISOString(),
          endTime: new Date(Date.now() - 82800000).toISOString(),
          startBattery: 15,
          endBattery: 95,
          charger: 'Fast Charger A - Downtown',
          energyAdded: 45.2,
        },
        {
          id: 'c2',
          startTime: new Date(Date.now() - 172800000).toISOString(),
          endTime: new Date(Date.now() - 169200000).toISOString(),
          startBattery: 20,
          endBattery: 100,
          charger: 'Home Charger',
          energyAdded: 52.8,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading charging history...</p>
        </div>
      </div>
    );
  }

  const avgChargeTime =
    sessions.length > 0
      ? Math.round(
          sessions.reduce(
            (acc, s) =>
              acc +
              (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) /
                60000,
            0
          ) / sessions.length
        )
      : 0;

  const totalEnergyAdded = sessions.reduce((acc, s) => acc + s.energyAdded, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <FloatingPanel />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Charging Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor battery health and charging sessions</p>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">Current SOC</p>
            <p className="text-4xl font-bold mt-2">{currentSOC}%</p>
            <div className="mt-4 w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${currentSOC}%` }}
              ></div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">Total Energy Added</p>
            <p className="text-4xl font-bold mt-2">{totalEnergyAdded.toFixed(1)} kWh</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">from {sessions.length} sessions</p>
          </Card>

          <Card className="p-6">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">Avg Charge Time</p>
            <p className="text-4xl font-bold mt-2">{avgChargeTime} min</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">per session</p>
          </Card>
        </div>

        {/* History */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Charging History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-2 font-semibold">Date</th>
                  <th className="text-left py-2 font-semibold">Charger</th>
                  <th className="text-left py-2 font-semibold">Battery %</th>
                  <th className="text-left py-2 font-semibold">Duration</th>
                  <th className="text-left py-2 font-semibold">Energy Added</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const duration = Math.round(
                    (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) /
                      60000
                  );
                  return (
                    <tr key={session.id} className="border-b border-gray-100 dark:border-slate-800">
                      <td className="py-3">{new Date(session.startTime).toLocaleDateString()}</td>
                      <td className="py-3">{session.charger}</td>
                      <td className="py-3">
                        {session.startBattery}% → {session.endBattery}%
                      </td>
                      <td className="py-3">{duration} min</td>
                      <td className="py-3 font-semibold">{session.energyAdded} kWh</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChargingPage;
