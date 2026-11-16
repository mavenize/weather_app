import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import { subscribe } from "./state/store.js";
import { getSavedPlace, loadLocation } from "./state/actions.js";

// Sections are appended to #content as each one is built (T-12 onwards).

// Brief step: log every state change, so loading → ready shows in the console.
subscribe((state) => console.log(`State: ${state.status}`, state));

loadLocation(getSavedPlace());
