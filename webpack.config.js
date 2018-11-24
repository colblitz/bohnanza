// import webpack from 'webpack';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var LiveReloadPlugin = require('webpack-livereload-plugin');
module.exports = {
  // entry: path.join(__dirname, ‘/src/index.js’),
  // output: {
  //     filename: ‘build.js’,
  //     path: path.join(__dirname, ‘/dist’)},
  // module:{
  //     rules:[{
  //        test: /\.js$/,
  //        exclude: /node_modules/,
  //        loader: ‘babel-loader’
  //     }]
  // },
  // plugins:[
  //     new HWP(
  //        {template: path.join(__dirname,‘/src/index.html’)}
  //     )
  // ]
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        use: 'babel-loader',
        test: /\.jsx$/,
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      },
      {
      	test: /\.scss$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader", options: {
                sourceMap: true
            }
        }, {
            loader: "sass-loader", options: {
                sourceMap: true
            }
        }]
      }
    ]
  },
  // devServer: {
  //   proxy: {
  //     '/': 'http://localhost:3001'
  //   }
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/index.html'
    }),
    new LiveReloadPlugin()
  ]
};