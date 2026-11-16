import { DEFAULT_PLACE, STORAGE_KEY } from "../data/config.js";
import { fetchWeather } from "../api/weather.js";
import { processWeather } from "../api/process-weather.js";
import { setState } from "./store.js";

// Fields kept when a place is saved, enough to load it again.
const SAVED_FIELDS = [
  "name",
  "country",
  "region",
  "latitude",
  "longitude",
  "timezone",
];

// HTTP statuses that mean the API could not resolve the location. Anything
// else (no response, 429, 5xx, a broken body) counts as a network problem.
const NOT_FOUND_STATUSES = [400, 404];

function errorKind(error) {
  return NOT_FOUND_STATUSES.includes(error?.status) ? "not-found" : "network";
}

function isValidPlace(place) {
  return (
    typeof place?.name === "string" &&
    Number.isFinite(place.latitude) &&
    Number.isFinite(place.longitude)
  );
}

// localStorage can throw (private mode, storage disabled, quota), so saving
// and reading are best effort and never break a load.
function savePlace(place) {
  try {
    const saved = Object.fromEntries(
      SAVED_FIELDS.filter((key) => place[key] !== undefined).map((key) => [
        key,
        place[key],
      ]),
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Not saved: the next visit starts at the default place instead.
  }
}

// The last place that loaded successfully, or the default place (Berlin) on
// a first visit or when the saved value is missing or unreadable.
export function getSavedPlace() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return isValidPlace(saved) ? saved : DEFAULT_PLACE;
  } catch {
    return DEFAULT_PLACE;
  }
}

// Each call gets a number. When a request finishes, its result is applied
// only if no newer loadLocation() has started since, so a slow older
// response can never overwrite a newer one.
let latestRequest = 0;

// Loads the weather for a place: status "loading", then "ready" with the new
// weather, or "error" with the previous weather kept. A place is saved for
// the next visit only once its weather has loaded.
export async function loadLocation(place) {
  const request = ++latestRequest;
  setState({ status: "loading", error: null, place });

  try {
    const json = await fetchWeather(place.latitude, place.longitude);
    const weather = processWeather(json, place);
    if (request !== latestRequest) return;
    setState({ status: "ready", error: null, weather });
    savePlace(place);
  } catch (error) {
    if (request !== latestRequest) return;
    console.error(error);
    setState({ status: "error", error: errorKind(error) });
  }
}
