import "./header.css";
import { createEl } from "../utils/dom.js";
import { getState, subscribe } from "../state/store.js";
import { createSearch } from "../components/search.js";

// The label of the place being shown. Before the first weather arrives there
// is no weather.place yet, so it falls back to the place being loaded.
function placeText({ weather, place }) {
  if (weather) return weather.place;
  return [place?.name, place?.country].filter(Boolean).join(", ");
}

// Place name, local date and search. The design's bell and menu buttons are
// replaced by the one search button, which createSearch() owns along with
// the panel it opens (plan.md, Decisions).
export function createHeader() {
  const header = createEl("header", { className: "header" });

  const text = createEl("div", { className: "header__text" });
  const place = createEl("h1", { className: "header__place" });
  const date = createEl("p", { className: "header__date" });
  text.append(place, date);

  header.append(text, createSearch());

  function render(state) {
    place.textContent = placeText(state);
    date.textContent = state.weather?.date ?? "";
  }

  render(getState());
  subscribe(render);

  return header;
}
