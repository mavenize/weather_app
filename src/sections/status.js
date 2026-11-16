import "./status.css";
import { COPY } from "../data/copy.js";
import { createEl } from "../utils/dom.js";
import { getState, subscribe } from "../state/store.js";

const ERROR_TEXT = {
  "not-found": COPY.status.notFound,
  network: COPY.status.network,
};

function messageFor({ status, error }) {
  if (status === "loading") return COPY.status.loading;
  if (status === "error") return ERROR_TEXT[error] ?? COPY.status.network;
  return "";
}

// Loading indicator and error messages. The section itself is a live region
// that is always in the page, so screen readers announce each new message.
// Without weather on screen, the message sits in the content area. With
// weather on screen, it floats at the bottom of the column and the shown
// weather stays as it is (plan.md, Decisions: Loading and Error state).
export function createStatus() {
  const section = createEl("section", {
    className: "status",
    attrs: { role: "status" },
  });

  function render(state, prevState) {
    if (
      prevState &&
      state.status === prevState.status &&
      state.error === prevState.error &&
      Boolean(state.weather) === Boolean(prevState.weather)
    ) {
      return;
    }

    const text = messageFor(state);
    section.classList.toggle("status--floating", Boolean(state.weather));
    if (!text) {
      section.replaceChildren();
      return;
    }

    const box = createEl("div", {
      className: `status__box status__box--${state.status}`,
    });
    if (state.status === "loading") {
      box.append(
        createEl("span", {
          className: "status__spinner",
          attrs: { "aria-hidden": "true" },
        }),
      );
    }
    box.append(createEl("p", { className: "status__text", text }));

    // A floating error stays until the next load, so it can be closed.
    if (state.status === "error" && state.weather) {
      const dismiss = createEl("button", {
        className: "status__dismiss",
        attrs: { type: "button", "aria-label": COPY.status.dismiss },
      });
      dismiss.append(
        createEl("span", {
          className: "status__dismiss-icon",
          attrs: { "aria-hidden": "true" },
        }),
      );
      dismiss.addEventListener("click", () => section.replaceChildren());
      box.append(dismiss);
    }

    section.replaceChildren(box);
  }

  render(getState());
  subscribe(render);

  return section;
}
