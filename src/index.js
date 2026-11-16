import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import { DEFAULT_PLACE } from "./data/config.js";
import { fetchWeather } from "./api/weather.js";

// Sections are appended to #content as each one is built (T-11 onwards).

// Brief step: log the raw API response. T-11 replaces this with loadLocation().
fetchWeather(DEFAULT_PLACE.latitude, DEFAULT_PLACE.longitude)
  .then((json) => console.log("Raw weather JSON", json))
  .catch((error) => console.error(error));
