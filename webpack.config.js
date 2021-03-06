const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { version, name } = require('./package.json');

module.exports = {
  entry: './src/scripts/index.js',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: `${name}-${version}.min.js`,
    path: path.resolve(__dirname, 'dist'),
    clean: false
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `${name}-${version}.min.css`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            "plugins": [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-object-rest-spread",
              "@babel/plugin-transform-async-to-generator"
            ]
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /src\/fonts/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
    ],
  },
};