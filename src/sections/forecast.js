import "./forecast.css";
import { COPY } from "../data/copy.js";
import { createEl } from "../utils/dom.js";
import { formatTemp } from "../utils/format.js";
import { getState, subscribe } from "../state/store.js";
import { createWeatherIcon } from "../components/weather-icon.js";

const LIST_ID = "forecast-list";

// One day: "Mon", icon, "26°C", "Partly Cloudy". The icon is decorative
// because the condition text is in the same row.
function createRow(day) {
  const row = createEl("li", { className: "forecast__row" });
  row.append(
    createEl("span", { className: "forecast__day", text: day.day }),
    createWeatherIcon(day.icon, { size: "md" }),
    createEl("span", {
      className: "forecast__temp",
      text: formatTemp(day.high, { withUnit: true }),
    }),
    createEl("span", {
      className: "forecast__condition",
      text: day.conditions,
    }),
  );
  return row;
}

function createCredits() {
  const credits = createEl("ul", { className: "forecast__credits" });
  credits.append(
    ...COPY.attribution.map(({ text, url }) => {
      const item = createEl("li");
      item.append(
        createEl("a", {
          className: "forecast__credit",
          text,
          attrs: { href: url },
        }),
      );
      return item;
    }),
  );
  return credits;
}

// The white bottom sheet. Collapsed it shows today and tomorrow, as in the
// design's first screen. The handle and title are one button that expands
// it over the card to all seven days (second screen) and collapses it again.
// The data attribution sits under the list in both states.
export function createForecast() {
  const section = createEl("section", { className: "forecast" });

  const heading = createEl("h2", { className: "forecast__heading" });
  const toggle = createEl("button", {
    className: "forecast__toggle",
    attrs: {
      type: "button",
      "aria-expanded": "false",
      "aria-controls": LIST_ID,
    },
  });
  const hint = createEl("span", { className: "visually-hidden" });
  toggle.append(
    createEl("span", {
      className: "forecast__handle",
      attrs: { "aria-hidden": "true" },
    }),
    createEl("span", {
      className: "forecast__title",
      text: COPY.forecast.title,
    }),
    hint,
  );
  heading.append(toggle);

  const list = createEl("ol", {
    className: "forecast__list",
    attrs: { id: LIST_ID },
  });

  section.append(heading, list, createCredits());

  function setExpanded(expanded) {
    section.classList.toggle("forecast--expanded", expanded);
    toggle.setAttribute("aria-expanded", String(expanded));
    hint.textContent = ` ${expanded ? COPY.forecast.collapse : COPY.forecast.expand}`;
    // The expanded sheet is laid out from the top of the page.
    if (expanded) window.scrollTo({ top: 0 });
  }

  toggle.addEventListener("click", () =>
    setExpanded(toggle.getAttribute("aria-expanded") !== "true"),
  );

  function render(state, prevState) {
    if (prevState && state.weather === prevState.weather) return;
    section.hidden = !state.weather;
    list.replaceChildren(...(state.weather?.days ?? []).map(createRow));
  }

  setExpanded(false);
  render(getState());
  subscribe(render);

  return section;
}
