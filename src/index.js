import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import { createEl } from "./utils/dom.js";
import { subscribe } from "./state/store.js";
import { getSavedPlace, loadLocation } from "./state/actions.js";
import { createHeader } from "./sections/header.js";

// The header and current conditions share the dark card (styles/base.css).
const card = createEl("div", { className: "card" });
card.append(createHeader());

document.getElementById("content").append(card);

// Brief step: log every state change, so loading → ready shows in the console.
subscribe((state) => console.log(`State: ${state.status}`, state));

loadLocation(getSavedPlace());
