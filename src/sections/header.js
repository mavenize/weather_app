import "./header.css";
import { COPY } from "../data/copy.js";
import { createEl } from "../utils/dom.js";
import { getState, subscribe } from "../state/store.js";

// The label of the place being shown. Before the first weather arrives there
// is no weather.place yet, so it falls back to the place being loaded.
function placeText({ weather, place }) {
  if (weather) return weather.place;
  return [place?.name, place?.country].filter(Boolean).join(", ");
}

// Place name, local date and the search button. The design's bell and menu
// buttons are replaced by the one search button (plan.md, Decisions).
export function createHeader() {
  const header = createEl("header", { className: "header" });

  const text = createEl("div", { className: "header__text" });
  const place = createEl("h1", { className: "header__place" });
  const date = createEl("p", { className: "header__date" });
  text.append(place, date);

  const searchButton = createEl("button", {
    className: "header__button",
    attrs: { type: "button", "aria-label": COPY.header.searchButton },
  });
  searchButton.append(
    createEl("span", {
      className: "header__icon header__icon--search",
      attrs: { "aria-hidden": "true" },
    }),
  );

  header.append(text, searchButton);

  function render(state) {
    place.textContent = placeText(state);
    date.textContent = state.weather?.date ?? "";
  }

  render(getState());
  subscribe(render);

  return header;
}
