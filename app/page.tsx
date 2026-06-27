"use client";

import { useState, useEffect } from "react";

// Ορισμός των τύπων για το TypeScript
interface AirQualityData {
  city: string;
  aqi: { value: number; label: string };
  pollutants: {
    pm2_5: number;
    pm10: number;
    co: number;
    no2: number;
    o3: number;
    so2: number;
  };
  updatedAt: string;
}

export default function Home() {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Συνάρτηση κλήσης του δικού μας API
  const fetchAirQuality = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/air-quality");
      if (!response.ok) {
        throw new Error("Αποτυχία φόρτωσης δεδομένων.");
      }
      const jsonData: AirQualityData = await response.json();
      setData(jsonData);
    } catch (err: any) {
      setError(err.message || "Κάτι πήγε στραβά.");
    } finally {
      setLoading(false);
    }
  };

  // Φόρτωση δεδομένων με το που ανοίγει η σελίδα
  useEffect(() => {
    fetchAirQuality();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Thessaloniki Air Quality</h1>
          <button 
            onClick={fetchAirQuality}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Refresh
          </button>
        </div>

        {/* --- Loading State --- */}
        {loading && (
          <div className="text-center py-10 text-gray-500">
            Φόρτωση δεδομένων ποιότητας αέρα...
          </div>
        )}

        {/* --- Error State --- */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* --- UI Δεδομένων --- */}
        {data && !loading && !error && (
          <>
            {/* Main Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
              <h2 className="text-lg text-gray-500 font-medium mb-2">Air Quality Index (AQI)</h2>
              <div className="text-6xl font-extrabold text-blue-900 mb-2">{data.aqi.value}</div>
              <div className="text-2xl font-bold text-blue-600 mb-4">{data.aqi.label}</div>
              <div className="text-sm text-gray-400">
                Last updated: {new Date(data.updatedAt).toLocaleString("el-GR")}
              </div>
            </div>

            {/* Pollutants Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <PollutantCard name="PM2.5" value={data.pollutants.pm2_5} />
              <PollutantCard name="PM10" value={data.pollutants.pm10} />
              <PollutantCard name="CO" value={data.pollutants.co} />
              <PollutantCard name="NO₂" value={data.pollutants.no2} />
              <PollutantCard name="O₃" value={data.pollutants.o3} />
              <PollutantCard name="SO₂" value={data.pollutants.so2} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

// Βοηθητικό component για τις μικρές κάρτες των ρύπων
function PollutantCard({ name, value }: { name: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
      <div className="text-gray-500 font-semibold mb-1">{name}</div>
      <div className="text-xl font-bold text-gray-800">
        {value} <span className="text-xs font-normal text-gray-400">μg/m³</span>
      </div>
    </div>
  );
}