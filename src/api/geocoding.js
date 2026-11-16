import { GEOCODING_API } from "../data/config.js";

// Builds the Open-Meteo Geocoding URL for a search term.
export function buildGeocodingUrl(query) {
  const { baseUrl, params } = GEOCODING_API;
  const search = new URLSearchParams({ name: query, ...params });
  return `${baseUrl}?${search}`;
}

// One Open-Meteo result as the app's place. `label` ("Berlin, Germany") is
// what the UI shows and what processWeather() builds from name and country.
// `region` ("State of Berlin") tells apart places that share a label.
function toPlace(result) {
  return {
    id: result.id,
    name: result.name,
    country: result.country ?? "",
    region: result.admin1 ?? "",
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
    label: [result.name, result.country].filter(Boolean).join(", "),
  };
}

// Resolves with up to GEOCODING_API.params.count places for the search term,
// best match first. A term shorter than minQueryLength resolves with [] and
// sends no request. Open-Meteo leaves out `results` when nothing matches,
// which also resolves with [].
// Rejects on a network failure or a non-OK response. If `signal` aborts, the
// AbortError is passed through unchanged so the caller can ignore it.
export async function searchCities(query, { signal } = {}) {
  const term = query.trim();
  if (term.length < GEOCODING_API.minQueryLength) return [];

  let response;
  try {
    response = await fetch(buildGeocodingUrl(term), { signal });
  } catch (cause) {
    if (cause.name === "AbortError") throw cause;
    throw new Error("City search failed: no response", { cause });
  }

  if (!response.ok) {
    throw new Error(`City search failed: HTTP ${response.status}`);
  }

  const data = await response.json();
  return (data.results ?? []).map(toPlace);
}
