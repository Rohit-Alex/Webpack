const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const port = process.env.PORT || 4004;
module.exports = {
  mode: "development",
  entry: "/src/index.tsx", // main js
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"), // output folder
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader", // for styles
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      components: path.resolve(__dirname, "src/components"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // base html
      inject: true,
      ...(process.env.NODE_ENV === "production" && {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    }),
  ],
  devServer: {
    host: "localhost",
    port: port,
    historyApiFallback: true,
    open: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
          },
        },
        parallel: 4,
        extractComments: false,
      }),
    ],
  },
};
