// All text shown in the UI. Strings marked "design" are verbatim from
// design_files/UI_screens.png. The rest are new, for features the design
// does not show (search, loading, errors, attribution, screen-reader labels).

export const COPY = {
  pageTitle: "Weather",

  header: {
    searchButton: "Search for a city", // accessible name of the search icon button
  },

  search: {
    label: "City",
    placeholder: "Search for a city",
    close: "Close search",
    suggestions: "Suggested cities",
    noResults: "No cities found",
    error: "Couldn't load suggestions. Try again.",
  },

  current: {
    high: "High :", // design
    low: "Low :", // design
    humidity: "Humidity", // design
    wind: "Wind", // design
    rain: "Rain", // design
  },

  hourly: {
    now: "Now", // design
    label: "Hourly forecast",
  },

  forecast: {
    title: "7-Day Forecast", // design
    expand: "Show all 7 days",
    collapse: "Show fewer days",
  },

  status: {
    loading: "Loading weather…",
    notFound: "We couldn't find that place.",
    network: "Couldn't load the weather. Check your connection and try again.",
  },

  attribution: [
    {
      text: "Weather data by Visual Crossing",
      url: "https://www.visualcrossing.com/",
    },
    { text: "Places by Open-Meteo", url: "https://open-meteo.com/" },
    { text: "GeoNames", url: "https://www.geonames.org/" },
  ],
};

// Condition text for each Visual Crossing icons2 value, in the design's
// short title-case style ("Partly Cloudy", "Showers"). The API's own text
// ("Rain, Partially cloudy") is longer and does not match the design.
export const CONDITION_LABELS = {
  "clear-day": "Sunny",
  "clear-night": "Clear",
  "partly-cloudy-day": "Partly Cloudy", // design
  "partly-cloudy-night": "Partly Cloudy", // design
  cloudy: "Cloudy",
  fog: "Fog",
  wind: "Windy",
  rain: "Rain",
  "showers-day": "Showers", // design
  "showers-night": "Showers", // design
  "thunder-rain": "Thunderstorms",
  "thunder-showers-day": "Thunder Showers",
  "thunder-showers-night": "Thunder Showers",
  snow: "Snow",
  "snow-showers-day": "Snow Showers",
  "snow-showers-night": "Snow Showers",
};
