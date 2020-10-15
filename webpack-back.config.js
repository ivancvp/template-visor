const path = require('path');

var webpack = require('webpack');

const nodeExternals = require('webpack-node-externals');

module.exports = {
  devtool: false,
  target:'node',
  mode: 'production',
  
  entry: {
          server:'./backend/server.js',
  	    },
  output: {

    path: path.resolve(__dirname, 'backend'),
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [path.resolve(__dirname, 'node_modules')]
},
  module: {
    rules: [
        { test: /\.json$/,type:'javascript/auto', loader: 'json-loader' },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
    ]
  },
  node: {
    __dirname: false
  },
  plugins: [
    new webpack.IgnorePlugin(/^pg-native$/)
  ],
  externals: {
    "./movilidad.json": "commonjs ./movilidad.json",
    "./hoteles.json": "commonjs ./hoteles.json",
    "./hospitales.json": "commonjs ./hospitales.json",
},

};