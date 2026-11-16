import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import { DEFAULT_THEME } from "./data/themes.js";
import { createEl } from "./utils/dom.js";
import { getState, subscribe } from "./state/store.js";
import { getSavedPlace, loadLocation } from "./state/actions.js";
import { createHeader } from "./sections/header.js";
import { createCurrent } from "./sections/current.js";
import { createHourly } from "./sections/hourly.js";
import { createForecast } from "./sections/forecast.js";
import { createStatus } from "./sections/status.js";

// The header and current conditions share the dark card (styles/base.css).
const card = createEl("div", { className: "card" });
card.append(createHeader(), createCurrent());

document
  .getElementById("content")
  .append(card, createStatus(), createHourly(), createForecast());

// The look follows the weather on screen: tokens.css swaps colours per
// data-theme. After a failed load the previous weather, and its theme, stay.
function applyTheme(state) {
  document.documentElement.dataset.theme =
    state.weather?.theme ?? DEFAULT_THEME;
}
applyTheme(getState());
subscribe(applyTheme);

// Brief step: log every state change, so loading → ready shows in the console.
subscribe((state) => console.log(`State: ${state.status}`, state));

loadLocation(getSavedPlace());
