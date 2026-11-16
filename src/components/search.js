import "./search.css";
import { COPY } from "../data/copy.js";
import { GEOCODING_API, SEARCH_DEBOUNCE_MS } from "../data/config.js";
import { createEl } from "../utils/dom.js";
import { debounce } from "../utils/debounce.js";
import { searchCities } from "../api/geocoding.js";
import { loadLocation } from "../state/actions.js";

const IDS = {
  panel: "search-panel",
  input: "search-input",
  list: "search-list",
  option: (index) => `search-option-${index}`,
};

function createIcon(name) {
  return createEl("span", {
    className: `search__icon search__icon--${name}`,
    attrs: { "aria-hidden": "true" },
  });
}

function createIconButton(name, label) {
  const button = createEl("button", {
    className: "search__button",
    attrs: { type: "button", "aria-label": label },
  });
  button.append(createIcon(name));
  return button;
}

// The header's search button and the panel it opens. Typing shows city
// suggestions (one request per pause in typing). Picking one, by click or
// Enter, closes the panel and loads that city. Escape closes it.
// The input and list follow the ARIA combobox pattern: focus stays in the
// input and aria-activedescendant marks the highlighted suggestion.
export function createSearch() {
  const root = createEl("div", { className: "search" });

  const toggle = createIconButton("search", COPY.header.searchButton);
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", IDS.panel);

  const panel = createEl("div", {
    className: "search__panel",
    attrs: { id: IDS.panel, hidden: "" },
  });

  const form = createEl("form", {
    className: "search__form",
    attrs: { role: "search" },
  });
  const label = createEl("label", {
    className: "search__label",
    text: COPY.search.label,
    attrs: { for: IDS.input },
  });
  const input = createEl("input", {
    className: "search__input",
    attrs: {
      id: IDS.input,
      type: "text",
      placeholder: COPY.search.placeholder,
      autocomplete: "off",
      spellcheck: "false",
      enterkeyhint: "search",
      role: "combobox",
      "aria-autocomplete": "list",
      "aria-expanded": "false",
      "aria-controls": IDS.list,
    },
  });
  const closeButton = createIconButton("close", COPY.search.close);
  form.append(label, input, closeButton);

  const list = createEl("ul", {
    className: "search__list",
    attrs: {
      id: IDS.list,
      role: "listbox",
      "aria-label": COPY.search.suggestions,
      hidden: "",
    },
  });
  const message = createEl("p", {
    className: "search__message",
    attrs: { role: "status" },
  });

  panel.append(form, list, message);
  root.append(toggle, panel);

  // Suggestions on screen, the query they belong to, and the highlighted one.
  let results = [];
  let resultsQuery = "";
  let active = -1;
  let controller = null;

  function setActive(index) {
    active = index;
    [...list.children].forEach((option, i) =>
      option.setAttribute("aria-selected", String(i === active)),
    );
    if (active >= 0) {
      input.setAttribute("aria-activedescendant", IDS.option(active));
      list.children[active].scrollIntoView({ block: "nearest" });
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function showResults(query, places, text = "") {
    results = places;
    resultsQuery = query;
    list.replaceChildren(
      ...places.map((place, index) => {
        const option = createEl("li", {
          className: "search__option",
          attrs: { id: IDS.option(index), role: "option" },
        });
        option.append(
          createEl("span", {
            className: "search__option-label",
            text: place.label,
          }),
        );
        if (place.region) {
          option.append(
            createEl("span", {
              className: "search__option-region",
              text: place.region,
            }),
          );
        }
        option.addEventListener("click", () => pick(place));
        return option;
      }),
    );
    list.hidden = places.length === 0;
    input.setAttribute("aria-expanded", String(places.length > 0));
    message.textContent = text;
    setActive(-1);
  }

  // Fetches suggestions for `query` and shows them. Resolves with the places,
  // or null if a newer search replaced this one.
  async function runSearch(query) {
    controller?.abort();
    controller = null;
    if (query.length < GEOCODING_API.minQueryLength) {
      showResults(query, []);
      return [];
    }

    controller = new AbortController();
    try {
      const places = await searchCities(query, { signal: controller.signal });
      showResults(query, places, places.length ? "" : COPY.search.noResults);
      return places;
    } catch (error) {
      if (error.name === "AbortError") return null;
      console.error(error);
      showResults(query, [], COPY.search.error);
      return [];
    }
  }

  const searchAfterPause = debounce(
    () => runSearch(input.value.trim()),
    SEARCH_DEBOUNCE_MS,
  );

  function onOutsidePointer(event) {
    if (!root.contains(event.target)) close({ restoreFocus: false });
  }

  function open() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
    document.addEventListener("pointerdown", onOutsidePointer);
  }

  function close({ restoreFocus = true } = {}) {
    searchAfterPause.cancel();
    controller?.abort();
    controller = null;
    input.value = "";
    showResults("", []);
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("pointerdown", onOutsidePointer);
    if (restoreFocus) toggle.focus();
  }

  function pick(place) {
    close();
    loadLocation(place);
  }

  toggle.addEventListener("click", open);
  closeButton.addEventListener("click", () => close());

  // Tabbing out of the panel closes it, so it never sits open over the page
  // while keyboard focus is somewhere else.
  root.addEventListener("focusout", (event) => {
    if (
      !panel.hidden &&
      event.relatedTarget &&
      !root.contains(event.relatedTarget)
    ) {
      close({ restoreFocus: false });
    }
  });

  input.addEventListener("input", () => {
    const query = input.value.trim();
    if (query.length < GEOCODING_API.minQueryLength) {
      searchAfterPause.cancel();
      runSearch(query);
    } else {
      searchAfterPause();
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    if (results.length === 0) return;
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 1 : -1;
    setActive((active + step + results.length) % results.length);
  });

  // Enter, or the Go key on a phone keyboard. If the suggestions on screen
  // are for an older query, search now instead of waiting for the pause.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = input.value.trim();
    let places = results;
    let index = active;
    if (query !== resultsQuery) {
      searchAfterPause.cancel();
      places = await runSearch(query);
      index = -1;
    }
    if (places?.length && !panel.hidden) pick(places[index] ?? places[0]);
  });

  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  // Keep focus in the input when a suggestion is pressed.
  list.addEventListener("pointerdown", (event) => event.preventDefault());

  return root;
}
