const path = require("path");
const { EnvironmentPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const revisionInfo = require("@macrostrat/revision-info-webpack");
const pkg = require("./package.json");
const dotenv = require("dotenv");
dotenv.config();

const mode = process.env.NODE_ENV || "development";

let publicURL = process.env.PUBLIC_URL || "/";

const packageSrc = (name) =>
  path.resolve(
    __dirname,
    "..",
    "deps",
    "ui-components",
    "packages",
    name,
    "src"
  );

const gitEnv = revisionInfo(pkg, "https://github.com/UW-Macrostrat/stratiform");

let babelLoader = {
  loader: "babel-loader",
  options: {
    sourceMap: mode == "development",
  },
};

const cssModuleLoader = {
  loader: "css-loader",
  options: {
    modules: {
      mode: "local",
      localIdentName: "[local]-[hash:base64:6]",
    },
  },
};

const plugins = [
  new HtmlWebpackPlugin({
    title: "Stratiform",
  }),
  new EnvironmentPlugin({
    ...gitEnv,
    STORAGE_URL: process.env.STORAGE_URL,
    STORAGE_TOKEN: process.env.STORAGE_TOKEN,
    API_URL: process.env.API_URL,
  }),
];

const styleLoaders = ["style-loader", cssModuleLoader];

module.exports = {
  cache: false,
  mode,
  devServer: {
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [babelLoader],
        exclude: /node_modules/,
      },
      {
        test: /\.styl$/,
        use: [...styleLoaders, "stylus-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|scss)$/,
        use: [...styleLoaders, "sass-loader"],
      },
      // {
      //   test: /\.css$/,
      //   use: styleLoaders,
      //   exclude: /node_modules/,
      // },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {},
          },
        ],
      },
      {
        test: /\.(png|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              useRelativePath: true,
              outputPath: "sections/assets/",
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.mdx?$/,
        use: [babelLoader, "@mdx-js/loader"],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      react: require.resolve("react"),
      "~": path.resolve(__dirname, "src"),
      "@macrostrat/column-components": packageSrc("column-components"),
      "@macrostrat/ui-components": packageSrc("ui-components"),
    },
  },
  entry: {
    main: "./src/index.ts",
  },
  output: {
    path: path.join(__dirname, "/dist/"),
    publicPath: publicURL,
    filename: "[name].js",
    devtoolModuleFilenameTemplate: "file:///[absolute-resource-path]",
  },
  devtool: "source-map",
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true,
  },
  optimization: {
    splitChunks: { chunks: "all" },
    usedExports: true,
  },
  plugins,
};
