# City Weather API
An Express 5 service that gets weather info by calling the free Open-Meteo API (no API key needed). It turns a city name to coordinates, returns current weather and 3 day forecast, compares 2-5 cities at the same time and handles partial failures, puts a timeout on all upstream requests, and caches responses in memory.

## Run it

To run, it requires Node.js 24 or newer

npm install
cp .env.example .env
node src/server.js


## Environment variables

| Variable | Default | What it controls |
| --- | --- | --- |
| `PORT` | `4000` | Port the server listens on |
| `GEOCODING_URL` | `https://geocoding-api.open-meteo.com/v1` | Geocoding base URL |
| `FORECAST_URL` | `https://api.open-meteo.com/v1` | Forecast base URL |
| `UPSTREAM_TIMEOUT_MS` | `TODO: copy from src/config.js` | Timeout for each Open-Meteo request (in milliseconds)|
| `CACHE_TTL_SECONDS` | `600` | How long a cached city stays valid( in seconds)|

## Endpoints

- **GET `/api/weather?city=<name>`**
  - Displays current weather and 3-day forecast for 1 city.
  - Example: `curl "http://localhost:4000/api/weather?city=Toronto"`

- **GET `/api/compare?cities=<city1,city2,...>`**
  - Can compare 2-5 cities at once to find coldest/warmest.
  - Example: `curl "http://localhost:4000/api/compare?cities=Toronto,Vancouver,Halifax"`

- **GET `/api/cache/stats`**
  - Displays cache stats including hits, misses and active entries.
  - Example: `curl "http://localhost:4000/api/cache/stats"`

## Testing

```bash
# 1. Weather for a city: 200 (cached: false)
curl -i "http://localhost:4000/api/weather?city=Toronto"
 
# 2. Same city again, different capitals: 200 (cached: true, same fetchedAt)
curl -i "http://localhost:4000/api/weather?city=toronto"
 
# 3. Missing city: 400
curl -i "http://localhost:4000/api/weather"
 
# 4. City too short: 400
curl -i "http://localhost:4000/api/weather?city=a"
 
# 5. Unknown city: 404
curl -i "http://localhost:4000/api/weather?city=Zzzzqqxx"
 
# 6. Compare two cities: 200
curl -i "http://localhost:4000/api/compare?cities=Toronto,Halifax"
 
# 7. Compare with one unknown city: 200 (that city has ok: false, error.status 404)
curl -i "http://localhost:4000/api/compare?cities=Toronto,Zzzzqqxx"
 
# 8. Compare with only one city: 400
curl -i "http://localhost:4000/api/compare?cities=Toronto"
 
# 9. Cache statistics: 200
curl -i "http://localhost:4000/api/cache/stats"
 
# 10. Unknown route: 404
curl -i "http://localhost:4000/nope"
```
## Data source

Weather data provided by [Open-Meteo](https://open-meteo.com/).

## AI use

- Took the help of AI in the TTL cache (`cache.js`), `parseCities`, the `/api/compare`=,weather.js`.(to fix bugs and errors)
