import "./weather-icon.css";
import { FALLBACK_ICON, ICON_LOADERS } from "../data/icons.js";
import { createEl } from "../utils/dom.js";

// Icon sizes, each matching a place in the design: the hourly strip (sm),
// the forecast rows (md) and the current conditions card (lg).
const SIZES = ["sm", "md", "lg"];

// The Fluent Emoji PNG for a Visual Crossing icons2 value. A value missing
// from data/icons.js shows the fallback (Cloud).
//
// The CSS gives the <img> a fixed size, so the layout doesn't move while the
// PNG loads. The icon is decorative by default (alt=""), because the
// condition text always sits next to it. Pass `label` when it stands alone.
export function createWeatherIcon(icon, { size = "md", label = "" } = {}) {
  const sizeClass = SIZES.includes(size) ? size : "md";
  const img = createEl("img", {
    className: `weather-icon weather-icon--${sizeClass}`,
    attrs: { alt: label, decoding: "async", "data-icon": icon },
  });

  const load = ICON_LOADERS[icon] ?? ICON_LOADERS[FALLBACK_ICON];
  load()
    .then((module) => {
      img.src = module.default;
    })
    .catch((error) => console.error(error));

  return img;
}
