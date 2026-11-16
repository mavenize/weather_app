// Theme group for each Visual Crossing icons2 value. index.js sets the group
// as data-theme on the page, and tokens.css swaps colours per group (T-19).
// The design's blue is the clear-day theme.

export const THEMES = [
  "clear-day",
  "clear-night",
  "cloudy",
  "rain",
  "thunder",
  "snow",
  "fog",
];

export const DEFAULT_THEME = "clear-day";

export const ICON_THEMES = {
  "clear-day": "clear-day",
  "partly-cloudy-day": "clear-day",
  "clear-night": "clear-night",
  "partly-cloudy-night": "clear-night",
  cloudy: "cloudy",
  wind: "cloudy",
  fog: "fog",
  rain: "rain",
  "showers-day": "rain",
  "showers-night": "rain",
  "thunder-rain": "thunder",
  "thunder-showers-day": "thunder",
  "thunder-showers-night": "thunder",
  snow: "snow",
  "snow-showers-day": "snow",
  "snow-showers-night": "snow",
};
