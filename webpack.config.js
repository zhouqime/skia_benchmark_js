const path = require('path');
const webpack = require('webpack');


const CopyPlugin = require('copy-webpack-plugin');


const HtmlWebpackPlugin = require('html-webpack-plugin')




/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

module.exports = {
  mode: 'development',
  entry: './src/index.ts',

  plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin({
            template: 'index.html'
          }),
          new CopyPlugin({
            patterns:[
              {
                from: 'node_modules/canvaskit-wasm/bin/full/canvaskit.wasm'
              }
            ]
          }),],

  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      include: [path.resolve(__dirname, 'src')],
      exclude: [/node_modules/]
    }]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback:{
      "path":false,
      "fs":false
    }
  },

  devServer: {
    open: true,
    host: 'localhost',
    port:8512
  }
}