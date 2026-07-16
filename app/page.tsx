/*"use client";

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

        
        {loading && (
          <div className="text-center py-10 text-gray-500">
            Φόρτωση δεδομένων ποιότητας αέρα...
          </div>
        )}

        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

       
        {data && !loading && !error && (
          <>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
              <h2 className="text-lg text-gray-500 font-medium mb-2">Air Quality Index (AQI)</h2>
              <div className="text-6xl font-extrabold text-blue-900 mb-2">{data.aqi.value}</div>
              <div className="text-2xl font-bold text-blue-600 mb-4">{data.aqi.label}</div>
              <div className="text-sm text-gray-400">
                Last updated: {new Date(data.updatedAt).toLocaleString("el-GR")}
              </div>
            </div>

         
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
  */







"use client";

import { useState, useEffect } from "react";

// 1. Εδώ λέμε στο Next.js πώς ακριβώς μοιάζουν τα νέα μας δεδομένα
interface Pollutants {
  pm2_5: number;
  pm10: number;
  co: number;
  no2: number;
  o3: number;
  so2: number;
}

interface LiveData {
  city: string;
  aqi: { value: number; label: string };
  pollutants: Pollutants;
  updatedAt: string;
}

interface HistoryItem {
  id: number;
  createdAt: string;
  aqiValue: number;
  aqiLabel: string;
  pm2_5: number;
  pm10: number;
  co: number;
  no2: number;
  o3: number;
  so2: number;
}

interface ApiResponse {
  live: LiveData;
  history: HistoryItem[];
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAirQuality = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/air-quality");
      if (!response.ok) {
        throw new Error("Αποτυχία φόρτωσης δεδομένων.");
      }
      const jsonData: ApiResponse = await response.json();
      setData(jsonData);
    } catch (err: any) {
      setError(err.message || "Κάτι πήγε στραβά.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQuality();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* --- Επικεφαλίδα --- */}
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

        {loading && (
          <div className="text-center py-10 text-gray-500">
            Φόρτωση δεδομένων...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* --- UI Δεδομένων --- */}
        {data && !loading && !error && (
          <>
            {/* Κάρτα Τωρινών (Live) Δεδομένων */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center max-w-2xl mx-auto">
              <h2 className="text-lg text-gray-500 font-medium mb-2">Τωρινή Ποιότητα Αέρα (AQI)</h2>
              <div className="text-6xl font-extrabold text-blue-900 mb-2">{data.live.aqi.value}</div>
              <div className="text-2xl font-bold text-blue-600 mb-4">{data.live.aqi.label}</div>
              <div className="text-sm text-gray-400">
                Τελευταία ενημέρωση: {new Date(data.live.updatedAt).toLocaleString("el-GR")}
              </div>
            </div>

            {/* Πλέγμα με τους Ρύπους */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
              <PollutantCard name="PM2.5" value={data.live.pollutants.pm2_5} />
              <PollutantCard name="PM10" value={data.live.pollutants.pm10} />
              <PollutantCard name="CO" value={data.live.pollutants.co} />
              <PollutantCard name="NO₂" value={data.live.pollutants.no2} />
              <PollutantCard name="O₃" value={data.live.pollutants.o3} />
              <PollutantCard name="SO₂" value={data.live.pollutants.so2} />
            </div>

            {/* --- ΝΕΟ: Πίνακας Ιστορικού --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-12">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Ιστορικό 7 Ημερών</h3>
                <p className="text-sm text-gray-500">Οι παλαιότερες μετρήσεις από τη βάση δεδομένων μας</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                      <th className="p-4">Ημερομηνία</th>
                      <th className="p-4">AQI</th>
                      <th className="p-4">PM2.5</th>
                      <th className="p-4">PM10</th>
                      <th className="p-4">CO</th>
                      <th className="p-4">NO₂</th>
                      <th className="p-4">O₃</th>
                      <th className="p-4">SO₂</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {/* Εδώ παίρνουμε το ιστορικό και φτιάχνουμε μια γραμμή για κάθε μέρα */}
                    {data.history.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-700">
                          {new Date(row.createdAt).toLocaleDateString("el-GR")}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getAqiBadgeStyle(row.aqiValue)}`}>
                            {row.aqiValue} - {row.aqiLabel}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{row.pm2_5}</td>
                        <td className="p-4 text-gray-600">{row.pm10}</td>
                        <td className="p-4 text-gray-600">{row.co}</td>
                        <td className="p-4 text-gray-600">{row.no2}</td>
                        <td className="p-4 text-gray-600">{row.o3}</td>
                        <td className="p-4 text-gray-600">{row.so2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

// Βοηθητικό component για τις μικρές κάρτες (απλά το κάναμε λίγο πιο μικρό να χωράνε 6 στη σειρά)
function PollutantCard({ name, value }: { name: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
      <div className="text-gray-500 font-semibold mb-1 text-xs">{name}</div>
      <div className="text-lg font-bold text-gray-800">
        {value} <span className="block text-[10px] font-normal text-gray-400">μg/m³</span>
      </div>
    </div>
  );
}

// ΝΕΟ: Χρωματική σήμανση ανάλογα με το AQI για τον πίνακα!
function getAqiBadgeStyle(value: number) {
  switch (value) {
    case 1: return "bg-green-100 text-green-800";
    case 2: return "bg-yellow-100 text-yellow-800";
    case 3: return "bg-orange-100 text-orange-800";
    case 4: return "bg-red-100 text-red-800";
    case 5: return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
}