import "./hourly.css";
import { COPY, CONDITION_LABELS } from "../data/copy.js";
import { createEl } from "../utils/dom.js";
import { formatTemp } from "../utils/format.js";
import { getState, subscribe } from "../state/store.js";
import { createWeatherIcon } from "../components/weather-icon.js";

// One slot: time (or "Now"), icon and temperature. The slots show no
// condition text, so the icon carries the condition as its alt text.
function createSlot(hour) {
  const slot = createEl("li", {
    className: hour.isNow ? "hourly__slot hourly__slot--now" : "hourly__slot",
  });
  if (hour.isNow) slot.setAttribute("aria-current", "time");

  slot.append(
    createEl("span", {
      className: "hourly__time",
      text: hour.isNow ? COPY.hourly.now : hour.time,
    }),
    createWeatherIcon(hour.icon, {
      size: hour.isNow ? "md" : "sm",
      label: CONDITION_LABELS[hour.icon] ?? "",
    }),
    createEl("span", {
      className: "hourly__temp",
      text: formatTemp(hour.temp),
    }),
  );
  return slot;
}

// The six hourly slots around the current hour, already chosen and timed in
// the location's own time zone by processWeather(). Hidden until the first
// weather arrives, then redrawn only when the weather object changes.
export function createHourly() {
  const section = createEl("section", {
    className: "hourly",
    attrs: { "aria-label": COPY.hourly.label },
  });
  const list = createEl("ol", { className: "hourly__list" });
  section.append(list);

  function render(state, prevState) {
    if (prevState && state.weather === prevState.weather) return;
    section.hidden = !state.weather;
    list.replaceChildren(...(state.weather?.hours ?? []).map(createSlot));
  }

  render(getState());
  subscribe(render);

  return section;
}
