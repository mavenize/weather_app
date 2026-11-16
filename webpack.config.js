const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// `npm run build` passes --mode production. `npm run dev` passes no mode, so
// it builds in development.
module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/index.js",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    // Fast, accurate source maps while developing. None in production: the
    // site ships only the minified bundle, with no eval() and no inline maps.
    devtool: isProduction ? false : "eval-source-map",
    devServer: {
      watchFiles: ["./src/template.html"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/template.html",
        // The design's partly-cloudy icon (Fluent Emoji, MIT).
        favicon: "./src/assets/icons/sun-behind-small-cloud.png",
      }),
    ],
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
};
