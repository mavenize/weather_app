// Locale and units used by utils/format.js. The app shows °C and km/h only
// (client decision, see plan.md Decisions).
export const LOCALE = "en-US";

export const UNITS = {
  degree: "°",
  temperature: "°C",
  wind: "km/h",
  percent: "%",
};

// Visual Crossing Timeline API. No key: anonymous requests are allowed when
// the response is gzip-compressed, which browsers handle automatically.
// Request: `${baseUrl}/${lat},${lon}/${range}?${params}`.
// `elements` names every field api/process-weather.js reads. Since 2026-11-18
// the default anonymous response leaves out datetimeEpoch, so the fields are
// asked for by name rather than relying on the default set.
export const WEATHER_API = {
  baseUrl:
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline",
  range: "next6days",
  params: {
    unitGroup: "metric",
    include: "current,hours,days",
    elements:
      "datetime,datetimeEpoch,temp,tempmax,tempmin,humidity,windspeed,precipprob,conditions,icon",
    iconSet: "icons2",
    contentType: "json",
  },
};

// Open-Meteo Geocoding API, used for city suggestions while typing.
export const GEOCODING_API = {
  baseUrl: "https://geocoding-api.open-meteo.com/v1/search",
  params: {
    count: 5,
    language: "en",
    format: "json",
  },
  minQueryLength: 2,
};

// Loaded on a first visit, as in the design.
export const DEFAULT_PLACE = {
  name: "Berlin",
  country: "Germany",
  latitude: 52.52437,
  longitude: 13.41053,
  timezone: "Europe/Berlin",
};

export const SEARCH_DEBOUNCE_MS = 300;

// localStorage key for the last place the user picked.
export const STORAGE_KEY = "weather-app:last-place";

// Hourly strip: one hour before "Now" and four after, as in the design.
export const HOURLY_SLOTS = { before: 1, after: 4 };

// 7-day sheet: rows shown when collapsed and when expanded.
export const FORECAST_ROWS = { collapsed: 2, expanded: 7 };
