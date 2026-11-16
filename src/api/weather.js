import { WEATHER_API } from "../data/config.js";

// Builds the Visual Crossing Timeline URL for a pair of coordinates.
export function buildWeatherUrl(lat, lon) {
  const { baseUrl, range, params } = WEATHER_API;
  const query = new URLSearchParams(params);
  return `${baseUrl}/${lat},${lon}/${range}?${query}`;
}

// Error thrown by fetchWeather. `status` is the HTTP status, or 0 when the
// request never got a response (offline, DNS, CORS). state/actions.js uses it
// to pick the "not-found" or "network" message.
export class WeatherApiError extends Error {
  constructor(message, { status = 0, cause } = {}) {
    super(message, { cause });
    this.name = "WeatherApiError";
    this.status = status;
  }
}

// Fetches the forecast for lat, lon and resolves with the raw JSON.
// Rejects with a WeatherApiError on a network failure, a non-OK response or
// a body that isn't JSON.
export async function fetchWeather(lat, lon) {
  const url = buildWeatherUrl(lat, lon);

  let response;
  try {
    response = await fetch(url);
  } catch (cause) {
    throw new WeatherApiError("Weather request failed: no response", {
      cause,
    });
  }

  if (!response.ok) {
    // Visual Crossing explains errors in a plain-text body.
    const detail = (await response.text().catch(() => "")).trim();
    throw new WeatherApiError(
      `Weather request failed: HTTP ${response.status}${detail ? ` (${detail})` : ""}`,
      { status: response.status },
    );
  }

  try {
    return await response.json();
  } catch (cause) {
    throw new WeatherApiError("Weather response was not valid JSON", {
      status: response.status,
      cause,
    });
  }
}
