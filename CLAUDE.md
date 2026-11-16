# Weather App

A mobile-layout weather forecast site where anyone can search for a city and see current, hourly and 7-day weather from the Visual Crossing Weather API, with a °C/°F toggle. The UI is in English, rendered entirely from JavaScript and bundled with Webpack. `project_brief.md` holds the client brief.

`design_files` is the source of truth for look, copy and behaviour. Where it disagrees with this project's setup or `plan.md`, this project's setup and `plan.md` win.

`plan.md` holds the full project plan. This file holds the working rules.

## Commands

- `npm run dev`: live dev server at http://localhost:8080
- `npm run build`: production build to `dist/`
- `npm run lint`: ESLint on the whole project
- `npm run format`: Prettier rewrites every file
- `npm run check`: lint, format check and build in one go. This must pass before any task moves to `Testing`.
- `npx -y mcp-excalidraw-server start`: Excalidraw canvas at http://127.0.0.1:3000 for architecture diagrams (see [Architecture diagrams](#architecture-diagrams-excalidraw))

## Project setup (task T-01)

Every new JS project starts with this as its first task, before any feature code.

1. `git init`, then `npm init -y`. Set `"private": true` in `package.json`.
2. Add `.gitignore` with `node_modules` and `dist`.
3. Webpack:
   `npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin style-loader css-loader`
4. Prettier:
   `npm install --save-dev --save-exact prettier`
   Create an empty `.prettierrc` (`{}`) and a `.prettierignore`:
   ```
   dist
   package-lock.json
   .todo4vcode
   docs/diagrams
   design_files
   ```
   `.todo4vcode` is ignored so Prettier never rewrites the board file the extension owns. `docs/diagrams` is ignored because the Excalidraw MCP writes those files. The design source is ignored because it is reference material, not our code.
5. ESLint (needs Node 20.19+, 22.13+ or 24+):
   `npm install --save-dev eslint @eslint/js globals eslint-config-prettier`
   Create `eslint.config.mjs` (shown below). `eslint-config-prettier` goes last so it switches off every rule that would fight Prettier. Leave formatting to Prettier and correctness to ESLint.
6. Add the scripts:
   ```json
   "scripts": {
     "dev": "webpack serve --open",
     "build": "webpack --mode production",
     "lint": "eslint .",
     "lint:fix": "eslint . --fix",
     "format": "prettier . --write",
     "format:check": "prettier . --check",
     "check": "npm run lint && npm run format:check && npm run build"
   }
   ```
7. Run `npm run format` once so the first commit is already formatted, then `npm run check`.

`webpack.config.js` starting point:

```js
const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/template.html" })],
  module: {
    rules: [
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      {
        test: /\.(svg|png|jpe?g|webp|avif|gif|woff2?)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

`eslint.config.mjs` starting point:

```js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  { ignores: ["dist/", "design_files/"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["src/**/*.js"],
    languageOptions: { globals: globals.browser },
    rules: {
      // Enforces the no-innerHTML rule below, so lint catches it instead of a manual grep.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "AssignmentExpression > MemberExpression[property.name=/^(innerHTML|outerHTML)$/]",
          message: "Build DOM with createEl and appendChild.",
        },
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message: "Build DOM with createEl and appendChild.",
        },
      ],
    },
  },
  {
    files: ["webpack.config.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  eslintConfigPrettier,
]);
```

## Code rules

- Copy, URLs and other content live only in `src/data/`. Copy stays verbatim from the design.
- Use one DOM for all screen widths and adapt it with CSS. Breakpoints: ≤767, 768–1023, ≥1024.
- Style with classes and the tokens in `src/styles/tokens.css`. No inline styles, and no hard-coded colours outside that file.
- Each section or feature is a module that exports a `createX()` function returning an element, with its CSS beside it.
- Write code that passes `npm run lint` with no warnings. Do not disable a rule inline without saying why in the same comment.
- Install a package only when a task needs it, and say which task in the proposal.
- Never start a code comment with the words TODO, FIXME or NOTE, in any letter case. The task board extension scans every workspace file and imports those comments onto the board as tasks.

`createEl` helper (`src/utils/dom.js`):

```js
export function createEl(tag, { className, text, attrs = {} } = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  Object.entries(attrs).forEach(([name, value]) =>
    element.setAttribute(name, value),
  );
  return element;
}
```

Project layout:

```
src/
  index.js          imports global CSS, appends each section to #content
  template.html     <head> plus an empty <div id="content">
  data/             all copy, URLs and other content
  utils/dom.js      createEl
  components/       shared pieces (.js + .css pairs)
  sections/         one .js + .css pair per page section
  styles/           tokens.css, fonts.css, base.css
  assets/           images, fonts, icons
docs/
  diagrams/         architecture diagrams (.excalidraw sources + .svg exports)
```

## plan.md

Write `plan.md` before any feature code (task T-02). Planning runs in this order:

1. Read the design source and write **Overview**, **Decisions** and **Open questions**.
2. Draw the architecture diagrams in Excalidraw (see [Architecture diagrams](#architecture-diagrams-excalidraw)). Ask the user to review them on the canvas or in the exported SVGs. Revise until they approve.
3. Write **Architecture** from the approved diagrams. Then write **Tasks**, with one task per box in the module map, plus setup and finish tasks.
4. Write **Verification**.

Do not write the task tables until the user has approved the diagrams. Tasks drawn from an unreviewed architecture get thrown away when it changes.

`plan.md` holds:

- **Overview**: what is being built and from which source.
- **Decisions**: scope, assets and their sources, third-party embeds, anything agreed with the user.
- **Architecture**: the embedded diagram exports (`![Module map](docs/diagrams/module-map.svg)`), the folder tree and the module pattern.
- **Tasks**: one table per phase (`Phase 0: Setup`, `Phase 1: Foundation`, `Phase 2: Features`, `Phase 3: Finish`) with ID, task, priority and Definition of Done.
- **Open questions**: gaps in the design to confirm with the client. Build as drawn until they answer.
- **Verification**: how each task and the whole project are checked.

Every task carries these implicit DoD items: `npm run check` passes with no errors or warnings, and the task's files are formatted.

## Architecture diagrams (Excalidraw)

Architecture is drawn before it is written down. Diagrams are drawn during planning (T-02) with the Excalidraw MCP server [`mcp-excalidraw-server`](https://github.com/yctimlin/mcp_excalidraw). It gives Claude a live canvas plus tools that save `.excalidraw` and `.svg` files into the repo. It needs Node 20+.

The official Excalidraw MCP (`https://mcp.excalidraw.com`) is not used. It is a chat widget for apps that render MCP Apps, and its README documents no way to save files to the project.

### Setup (once per project, part of T-02)

1. Register the server at project scope so it is stored in `.mcp.json` and shared through git:
   ```sh
   claude mcp add excalidraw --scope project -- npx -y mcp-excalidraw-server
   ```
   This writes:
   ```json
   {
     "mcpServers": {
       "excalidraw": {
         "command": "npx",
         "args": ["-y", "mcp-excalidraw-server"]
       }
     }
   }
   ```
2. Restart Claude Code and approve the project server when prompted. Confirm with `claude mcp list` or `/mcp`.
3. Create `docs/diagrams/` and add it to `.prettierignore` (already shown in T-01).
4. Optional: watch the drawing live. The first drawing call starts the canvas automatically. To start it by hand, run `npx -y mcp-excalidraw-server start` and open http://127.0.0.1:3000. The tab must be open for `create_from_mermaid`, because its layout runs in the browser.
5. Optional: to edit diagrams by hand, install the VS Code extension **Excalidraw** (`pomdtr.excalidraw-editor`). It opens `.excalidraw` files in an editor tab. Opening them at excalidraw.com also works.

Notes:

- The MCP file tools only read and write inside `EXCALIDRAW_EXPORT_DIR`, which defaults to the working directory (the project root). Keep diagram paths under `docs/diagrams/`.
- The canvas has no authentication. Keep it on the default `127.0.0.1`, and never start it with `HOST=0.0.0.0`.
- To remove the server: `claude mcp remove excalidraw --scope project`.

### Diagrams to draw

| File         | Shows                                                                                                 | When                                     |
| ------------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `module-map` | `index.js`, each section and component module, and their imports from `data/`, `utils/` and `styles/` | Always                                   |
| `data-flow`  | External APIs, fetch and caching, state, and what triggers a re-render                                | When the app fetches data or keeps state |
| `deploy`     | Build output, hosting, and environment or secrets handling                                            | When there is more than a static `dist/` |

Every diagram is saved twice: `docs/diagrams/<name>.excalidraw` is the editable source, and `docs/diagrams/<name>.svg` is the export that `plan.md` embeds.

### How Claude draws

1. Call `read_diagram_guide` once per session before drawing.
2. Build the scene with `batch_create_elements`, or with `create_from_mermaid` for a quick first layout. Tidy it with `align_elements` and `distribute_elements`.
3. Check the result with `describe_scene` or `get_canvas_screenshot` before showing the user.
4. Save it with `export_scene` to `docs/diagrams/<name>.excalidraw` and `export_to_image` to `docs/diagrams/<name>.svg`.
5. To revise later, `import_scene` the `.excalidraw` file, edit it, then export both files again. Never hand-edit the SVG.

Diagram conventions:

- Labels match real names: file names, `createX()` functions and API endpoints.
- One colour per layer: sections, components, data/utils, external services. Include a small legend.
- Arrows point from importer to imported, or from data source to consumer. Label any arrow whose meaning is not obvious.

The diagrams are part of the architecture. If a task changes how modules connect, update the affected diagram in the same task and commit.

## Task board (todo4vcode)

The ToDo4VCode extension is in shared-file mode and watches `.todo4vcode/shared-tasks.json`, so edits to that file appear on the board. `plan.md` defines the tasks, and the board tracks their state. All code must belong to a task on the board. If work has no task, add one first.

Every task has:

- `text`: an ID and title, such as `T-07 · Shared components`
- `description`: goal and planned files, in plain text because the field does not render Markdown. When the commit is proposed, add a `Changed:` line listing every file in the proposed `git add`, one path per line, so the task records exactly which code belongs to it. The planned `Files:` line stays as written. `Changed:` lists what was actually touched.
- `priority`: `Must`, `Should`, `Could` or `Wont`
- `tags`: its phase, such as `phase-1`
- `subtasks`: its **Definition of Done**, one item per subtask, each prefixed `DoD:`, so progress shows as checkboxes

File shape:

```json
{
  "format": "todo4vcode-shared-tasks",
  "version": "1.0.0",
  "tasks": [
    {
      "id": "T-01",
      "text": "T-01 · Project setup",
      "description": "Goal: Webpack, ESLint and Prettier with a dev server, CSS and asset handling.\nFiles: package.json, webpack.config.js, eslint.config.mjs, .prettierrc, .prettierignore, .gitignore, src/index.js, src/template.html",
      "tags": ["phase-0"],
      "priority": "Must",
      "status": "Todo",
      "completed": false,
      "createdAt": 0,
      "order": 1000,
      "subtasks": [
        {
          "id": "T-01-d1",
          "text": "DoD: npm run dev serves the page",
          "completed": false
        },
        {
          "id": "T-01-d2",
          "text": "DoD: npm run lint and npm run format:check pass",
          "completed": false
        },
        {
          "id": "T-01-d3",
          "text": "DoD: node_modules and dist are git-ignored",
          "completed": false
        },
        {
          "id": "T-01-d4",
          "text": "DoD: npm run build compiles with no errors or warnings",
          "completed": false
        }
      ]
    }
  ]
}
```

Set `createdAt` to the current time in milliseconds (`Date.now()`).

When editing the file by hand:

- Keep the JSON valid, or the extension falls back to its last valid copy.
- Keep `completed` true only when `status` is `Done`.
- Give new tasks an `order` 1000 above the highest existing value, and the next free `T-` number.
- Re-read the file before each edit, because the user may have changed it in the extension.

Status flow:

- `Todo`: not started
- `In Progress`: being built, one task at a time
- `Testing`: Definition of Done checked and commit proposed, waiting on the user
- `Done`: the user has confirmed it

## Working loop

Build one task at a time, in plan order:

1. Set the task to `In Progress`.
2. Build only that task's scope. Anything else that turns up becomes a new task. If the build moves away from the module map, update the diagram as part of this task.
3. Run `npm run format`, then check every Definition of Done item, including `npm run check`. Tick only what was actually verified.
4. Set the task to `Testing` and stop. Report which items were verified and which need the user's eyes in a browser.
5. Propose the exact `git add <files>` list and the commit message alongside the code. In the same edit, write those files into the task's `description` under `Changed:`, leaving out `.todo4vcode/shared-tasks.json`. If the user changes the file list before committing, update `Changed:` to match.
6. When the user confirms, set the task to `Done`. That status change goes in with the next task's commit. Only then start the next task.

## Commits

The user commits and pushes. Do not run `git commit` or `git push` unless asked.

Every commit covers one task, names its ID, and stages `.todo4vcode/shared-tasks.json` with the code:

```
feat(T-07): add shared hours table component

Why it was needed, in one or two lines.

Task: T-07 · Shared components
```

Types: `feat`, `fix`, `style`, `refactor`, `chore`, `docs`.

## Deploying to GitHub Pages (optional)

`dist/` is git-ignored, so the build is force-added and pushed to the `gh-pages` branch as a subtree:

```sh
npm run build
git add dist -f
git commit -m "chore: deploy"
git push origin main
git subtree push --prefix dist origin gh-pages
```

Set `output.publicPath` or use relative asset paths if the site is served from a sub-path such as `/weather_app/`.
