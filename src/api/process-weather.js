import { CONDITION_LABELS } from "../data/copy.js";
import { DEFAULT_THEME, ICON_THEMES } from "../data/themes.js";
import { formatDate, formatDay, formatHour } from "../utils/format.js";

const HOUR_SLOTS = 6; // previous hour, Now, then the next four
const DAY_COUNT = 7;

// Whole number, with -0 turned into 0.
function toInt(value) {
  const rounded = Math.round(value ?? 0);
  return Object.is(rounded, -0) ? 0 : rounded;
}

// The design's short label for an icons2 value, or the API's own text for a
// value the table doesn't know.
function conditionLabel(icon, apiText) {
  return CONDITION_LABELS[icon] ?? apiText ?? "";
}

function placeLabel(place, json) {
  const parts = [place?.name, place?.country].filter(Boolean);
  return parts.length ? parts.join(", ") : json.resolvedAddress;
}

// Six hourly slots around the current hour, which is the last hour that
// started at or before now. Today's and tomorrow's hours are joined so the
// strip runs past midnight. In the first hour of the day there is no previous
// hour, so the strip starts at "Now".
function processHours(days, nowSeconds, timeZone) {
  const hours = days.slice(0, 2).flatMap((day) => day.hours ?? []);
  const nowIndex = hours.findLastIndex(
    (hour) => hour.datetimeEpoch <= nowSeconds,
  );
  const current = Math.max(nowIndex, 0);
  const start = Math.max(current - 1, 0);

  return hours.slice(start, start + HOUR_SLOTS).map((hour, i) => ({
    time: formatHour(hour.datetimeEpoch, timeZone),
    temp: toInt(hour.temp),
    icon: hour.icon,
    isNow: start + i === current,
  }));
}

function processDays(days, timeZone) {
  return days.slice(0, DAY_COUNT).map((day) => ({
    day: formatDay(day.datetimeEpoch, timeZone),
    high: toInt(day.tempmax),
    icon: day.icon,
    conditions: conditionLabel(day.icon, day.conditions),
  }));
}

// Reduces a Visual Crossing Timeline response to the app's weather object
// (shape in plan.md, Module pattern). `place` is the state's place, used for
// the "Berlin, Germany" label. `now` (ms) picks the current hour and date; it
// defaults to the clock and exists so the function stays pure and testable.
export function processWeather(json, place, { now = Date.now() } = {}) {
  const current = json?.currentConditions;
  const days = json?.days;
  if (!current || !Array.isArray(days) || days.length === 0) {
    throw new Error("Weather response is missing current conditions or days");
  }
  // Hours and day names are formatted from datetimeEpoch. Without it the
  // formatters throw a bare RangeError, so name the real problem instead.
  const firstHour = days[0].hours?.[0];
  if (
    !Number.isFinite(days[0].datetimeEpoch) ||
    !Number.isFinite(firstHour?.datetimeEpoch)
  ) {
    throw new Error("Weather response is missing datetimeEpoch");
  }

  const timeZone = json.timezone;
  const nowSeconds = Math.floor(now / 1000);
  const today = days[0];

  return {
    place: placeLabel(place, json),
    date: formatDate(nowSeconds, timeZone),
    theme: ICON_THEMES[current.icon] ?? DEFAULT_THEME,
    current: {
      temp: toInt(current.temp),
      high: toInt(today.tempmax),
      low: toInt(today.tempmin),
      icon: current.icon,
      conditions: conditionLabel(current.icon, current.conditions),
      humidity: toInt(current.humidity),
      wind: toInt(current.windspeed),
      rain: toInt(current.precipprob),
    },
    hours: processHours(days, nowSeconds, timeZone),
    days: processDays(days, timeZone),
  };
}
