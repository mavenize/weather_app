// Weather icon file for each Visual Crossing icons2 value. The icons are
// Microsoft Fluent Emoji, 3D PNG variant (MIT licence, see
// assets/icons/LICENSE), from https://github.com/microsoft/fluentui-emoji.
//
// Each loader resolves to a module whose `default` is the PNG's URL.
// webpackMode "eager" keeps the URL modules in the main bundle, so there is no
// extra JS request before the PNG. The browser fetches a PNG only when an
// <img> uses it, and Webpack emits only the files listed here.

const sun = () => import(/* webpackMode: "eager" */ "../assets/icons/sun.png");
const crescentMoon = () =>
  import(/* webpackMode: "eager" */ "../assets/icons/crescent-moon.png");
const sunBehindSmallCloud = () =>
  import(
    /* webpackMode: "eager" */ "../assets/icons/sun-behind-small-cloud.png"
  );
const cloud = () =>
  import(/* webpackMode: "eager" */ "../assets/icons/cloud.png");
const sunBehindRainCloud = () =>
  import(
    /* webpackMode: "eager" */ "../assets/icons/sun-behind-rain-cloud.png"
  );
const cloudWithRain = () =>
  import(/* webpackMode: "eager" */ "../assets/icons/cloud-with-rain.png");
const cloudWithLightningAndRain = () =>
  import(
    /* webpackMode: "eager" */ "../assets/icons/cloud-with-lightning-and-rain.png"
  );
const cloudWithSnow = () =>
  import(/* webpackMode: "eager" */ "../assets/icons/cloud-with-snow.png");
const fog = () => import(/* webpackMode: "eager" */ "../assets/icons/fog.png");
const windFace = () =>
  import(/* webpackMode: "eager" */ "../assets/icons/wind-face.png");

export const ICON_LOADERS = {
  "clear-day": sun,
  "clear-night": crescentMoon,
  "partly-cloudy-day": sunBehindSmallCloud,
  "partly-cloudy-night": cloud,
  cloudy: cloud,
  "showers-day": sunBehindRainCloud,
  "showers-night": cloudWithRain,
  rain: cloudWithRain,
  "thunder-rain": cloudWithLightningAndRain,
  "thunder-showers-day": cloudWithLightningAndRain,
  "thunder-showers-night": cloudWithLightningAndRain,
  snow: cloudWithSnow,
  "snow-showers-day": cloudWithSnow,
  "snow-showers-night": cloudWithSnow,
  fog,
  wind: windFace,
};

// Used for any icons2 value missing from ICON_LOADERS (T-14).
export const FALLBACK_ICON = "cloudy";
