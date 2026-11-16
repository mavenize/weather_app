import "./current.css";
import { COPY } from "../data/copy.js";
import { createEl } from "../utils/dom.js";
import { formatPercent, formatTemp, formatWind } from "../utils/format.js";
import { getState, subscribe } from "../state/store.js";
import { createWeatherIcon } from "../components/weather-icon.js";

// "High : 26°C" with its arrow. The arrow is decorative.
function createPill(label, temp, direction) {
  const pill = createEl("p", { className: "current__pill" });
  pill.append(
    `${label} ${formatTemp(temp, { withUnit: true })}`,
    createEl("span", {
      className: `current__arrow current__arrow--${direction}`,
      attrs: { "aria-hidden": "true" },
    }),
  );
  return pill;
}

// One column of the Humidity / Wind / Rain panel.
function createStat(label, value) {
  const stat = createEl("div", { className: "current__stat" });
  stat.append(
    createEl("dt", { className: "current__stat-label", text: label }),
    createEl("dd", { className: "current__stat-value", text: value }),
  );
  return stat;
}

function renderCurrent(current) {
  const summary = createEl("div", { className: "current__summary" });
  const reading = createEl("div", { className: "current__reading" });
  reading.append(
    createEl("p", {
      className: "current__temp",
      text: formatTemp(current.temp),
    }),
    createEl("p", {
      className: "current__condition",
      text: current.conditions,
    }),
  );
  summary.append(createWeatherIcon(current.icon, { size: "lg" }), reading);

  const pills = createEl("div", { className: "current__pills" });
  pills.append(
    createPill(COPY.current.high, current.high, "up"),
    createPill(COPY.current.low, current.low, "down"),
  );

  const stats = createEl("dl", { className: "current__stats" });
  stats.append(
    createStat(COPY.current.humidity, formatPercent(current.humidity)),
    createStat(COPY.current.wind, formatWind(current.wind)),
    createStat(COPY.current.rain, formatPercent(current.rain)),
  );

  return [summary, pills, stats];
}

// The top card's body: icon, temperature, condition, High and Low pills and
// the Humidity / Wind / Rain panel. Hidden until the first weather arrives,
// then redrawn only when the weather object changes.
export function createCurrent() {
  const section = createEl("section", {
    className: "current",
    attrs: { "aria-label": COPY.current.label },
  });

  function render(state, prevState) {
    if (prevState && state.weather === prevState.weather) return;
    section.hidden = !state.weather;
    section.replaceChildren(
      ...(state.weather ? renderCurrent(state.weather.current) : []),
    );
  }

  render(getState());
  subscribe(render);

  return section;
}
