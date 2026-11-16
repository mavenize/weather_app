# Weather App

A mobile-layout weather forecast site. Search for any city and see its current conditions, the hours around now and the next seven days. The page's colours change with the weather.

Live site: https://mavenize.github.io/weather_app/

## Features

- **City search with suggestions.** The search button opens a search bar. Suggestions appear as you type, and picking one loads its weather straight away.
- **Current conditions.** Temperature, condition, today's high and low, humidity, wind and chance of rain.
- **Hourly strip.** The previous hour, now and the next four hours, in the city's own time zone.
- **7-day forecast.** A bottom sheet that shows today and tomorrow, and expands to the whole week.
- **Weather themes.** Seven colour themes (clear day, clear night, cloudy, rain, thunder, snow and fog), each with text contrast of at least 4.5:1.
- **Loading and error states.** A loader while data arrives, and clear messages when a place can't be found or the network fails. The weather already on screen stays.
- **Remembers your city.** The last city you picked loads on your next visit. The first visit shows Berlin.
- **Accessible.** Works by keyboard alone, announces status changes to screen readers and respects reduced motion. Lighthouse mobile scores 100 for Accessibility.

Temperatures are in °C and wind in km/h.

## Run it locally

Needs Node.js 20.19+, 22.13+ or 24+.

```sh
npm install
npm run dev
```

The dev server opens http://localhost:8080.

| Script           | What it does                                             |
| ---------------- | -------------------------------------------------------- |
| `npm run dev`    | Dev server with live reload                              |
| `npm run build`  | Production build to `dist/`                              |
| `npm run lint`   | ESLint                                                   |
| `npm run format` | Prettier rewrites every file                             |
| `npm run check`  | Lint, format check and build. Must pass before a commit. |

## How it's built

Plain JavaScript modules bundled with Webpack, with no framework. The page is built entirely from JavaScript, and each part of the page is a module with its own CSS.

```
src/
  api/          fetch weather and city suggestions, shape the API data
  state/        a small store and the loadLocation() action
  sections/     header, current conditions, hourly strip, forecast sheet, status
  components/   search and weather icon
  data/         all text, API settings and theme mappings
  styles/       design tokens (all colours live here), fonts and base styles
  assets/       weather icons, interface icons and fonts
```

The full plan, decisions and architecture diagrams are in [plan.md](plan.md) and [docs/diagrams/](docs/diagrams/).

## Credits

- Weather data: [Visual Crossing Weather API](https://www.visualcrossing.com/). No API key is needed.
- City suggestions: [Open-Meteo Geocoding API](https://open-meteo.com/), with place data from [GeoNames](https://www.geonames.org/) (CC BY 4.0).
- Weather icons: [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji), 3D style, MIT licence (`src/assets/icons/LICENSE`).
- Font: [Archivo](https://github.com/Omnibus-Type/Archivo) by Omnibus-Type, SIL Open Font License 1.1 (`src/assets/fonts/OFL.txt`).
- Design: `design_files/UI_screens.png`, supplied with the project brief.

## Deploy to GitHub Pages

`dist/` is git-ignored, so the build is force-added and pushed to the `gh-pages` branch as a subtree:

```sh
npm run build
git add dist -f
git commit -m "chore: deploy"
git push origin main
git subtree push --prefix dist origin gh-pages
```

All asset paths are relative, so the site works under `/weather_app/`.
