# Thessaloniki Air Pollution API Endpoint (Next.js App Router)

A robust, production-ready backend route built with **Next.js 13+ (Route Handlers)** that fetches, normalizes, and serves real-time air quality data for Thessaloniki, Greece, leveraging the **OpenWeather Air Pollution API**.

## Architectural & Development Highlights

* **Secure Environment Management:** Implements strict security best practices by abstracting sensitive credentials (`OPENWEATHER_API_KEY`) into server-side environment variables (`.env.local`), ensuring zero exposure on public repositories via automated `.gitignore` policies.
* **Edge-Ready Data Fetching:** Utilizes native Next.js `fetch` extensions with explicit cache invalidation (`cache: "no-store"`) to guarantee real-time data delivery without stale responses.
* **Defensive Programming & Error Handling:** Features complete try/catch blocks and granular HTTP status propagation to handle both upstream API failures and missing server configuration gracefully.
* **Data Normalization:** Professionally maps raw, nested API responses into a clean, intuitive, and strongly-typed JSON structure (including dynamic mapping for Air Quality Index (AQI) labels).

## Tech Stack
* **Framework:** Next.js (TypeScript)
* **Runtime:** Node.js / Next.js Serverless Environment
* **Data Provider:** OpenWeather API