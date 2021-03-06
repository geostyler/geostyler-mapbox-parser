const webpack = require("webpack");
require("@babel/polyfill");

module.exports = {
  entry: ["@babel/polyfill", "./src/MapboxStyleParser.ts"],
  output: {
    filename: "mapboxStyleParser.js",
    path: __dirname + "/browser",
    library: "GeoStylerMapboxParser"
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".js", ".json"]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.ts$/,
        include: /src/,
        loader: "awesome-typescript-loader"
      },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ]
};
