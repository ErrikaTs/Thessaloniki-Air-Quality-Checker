import { NextResponse } from "next/server";
import pool from "@/lib/db";

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

  if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

  try {
    // 1. Παίρνουμε τα live δεδομένα
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${THESSALONIKI_LAT}&lon=${THESSALONIKI_LON}&appid=${apiKey}`,
      { cache: "no-store" }
    );
    
    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    const current = data.list[0];

    // 2. Γράφουμε τα δεδομένα στη βάση
    const query = `
      INSERT INTO air_quality_log (aqi_value, aqi_label, pm2_5, pm10, co, no2, o3, so2)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;

    const values = [
      current.main.aqi,
      aqiLabels[current.main.aqi] || "Unknown",
      current.components.pm2_5,
      current.components.pm10,
      current.components.co,
      current.components.no2,
      current.components.o3,
      current.components.so2
    ];

    await pool.query(query, values);

    return NextResponse.json({ success: true, message: "Τα σημερινά δεδομένα αποθηκεύτηκαν επιτυχώς!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Σφάλμα κατά την αποθήκευση" }, { status: 500 });
  }
}