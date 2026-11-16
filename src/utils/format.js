import { LOCALE, UNITS } from "../data/config.js";

// Rounds to a whole number and turns -0 into 0, so -0.4 shows as "0°".
function round(value) {
  const rounded = Math.round(value);
  return Object.is(rounded, -0) ? 0 : rounded;
}

// "24°", or "24°C" with { withUnit: true }.
export function formatTemp(value, { withUnit = false } = {}) {
  return `${round(value)}${withUnit ? UNITS.temperature : UNITS.degree}`;
}

// "19 km/h"
export function formatWind(value) {
  return `${round(value)} ${UNITS.wind}`;
}

// "62%"
export function formatPercent(value) {
  return `${round(value)}${UNITS.percent}`;
}

// Date and time helpers take Unix seconds (Visual Crossing's datetimeEpoch)
// and the location's IANA time zone, so the result follows the searched
// city's clock rather than the device's.
const formatters = new Map();

function formatter(timeZone, options) {
  const key = `${timeZone}|${JSON.stringify(options)}`;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.DateTimeFormat(LOCALE, { ...options, timeZone }),
    );
  }
  return formatters.get(key);
}

const toDate = (epochSeconds) => new Date(epochSeconds * 1000);

// "Monday, June 23"
export function formatDate(epochSeconds, timeZone) {
  return formatter(timeZone, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(toDate(epochSeconds));
}

// "13:00"
export function formatHour(epochSeconds, timeZone) {
  return formatter(timeZone, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(toDate(epochSeconds));
}

// "Mon"
export function formatDay(epochSeconds, timeZone) {
  return formatter(timeZone, { weekday: "short" }).format(toDate(epochSeconds));
}
