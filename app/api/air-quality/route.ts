import { NextResponse } from "next/server";
import pool from "@/lib/db"; 

export const dynamic = "force-dynamic";

const THESSALONIKI_LAT = 40.6401;
const THESSALONIKI_LON = 22.9444;

const aqiLabels: Record<number, string> = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "To API key λείπει." }, { status: 500 });
  }

  try {
    // 1. Παίρνουμε τα live δεδομένα από το OpenWeather
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${THESSALONIKI_LAT}&lon=${THESSALONIKI_LON}&appid=${apiKey}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Αποτυχία λήψης δεδομένων από το OpenWeather." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const pollutionData = data.list[0];

    const liveData = {
      city: "Thessaloniki",
      coordinates: { lat: THESSALONIKI_LAT, lon: THESSALONIKI_LON },
      aqi: {
        value: pollutionData.main.aqi,
        label: aqiLabels[pollutionData.main.aqi] || "Unknown",
      },
      pollutants: pollutionData.components,
      updatedAt: new Date().toISOString(),
    };

    // 2. Παίρνουμε το ιστορικό 7 ημερών από τη βάση μας (PostgreSQL)
    const historyQuery = `
      SELECT id, created_at as "createdAt", aqi_value as "aqiValue", aqi_label as "aqiLabel", 
             pm2_5 as "pm2_5", pm10, co, no2, o3, so2
      FROM air_quality_log
      ORDER BY created_at DESC
      LIMIT 7;
    `;
    const dbResult = await pool.query(historyQuery);

    // 3. Στέλνουμε στο frontend και τα δύο μαζί!
    return NextResponse.json({
      live: liveData,
      history: dbResult.rows,
    });
  } catch (error) {
    console.error("Σφάλμα API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}