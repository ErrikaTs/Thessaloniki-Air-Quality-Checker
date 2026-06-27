import { NextResponse } from "next/server";

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

    const formattedData = {
      city: "Thessaloniki",
      coordinates: {
        lat: THESSALONIKI_LAT,
        lon: THESSALONIKI_LON,
      },
      aqi: {
        value: pollutionData.main.aqi,
        label: aqiLabels[pollutionData.main.aqi] || "Unknown",
      },
      pollutants: pollutionData.components,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}