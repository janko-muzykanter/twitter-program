
var webpack = require('webpack');
var HtmlPlugin = require('html-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

var path = require('path');
var fs = require('fs');

var dir = fs.realpathSync(process.cwd());

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    /* Tutaj ważna linia */
    path: path.resolve(dir, '../backend/'),
    pathinfo: true,
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    modules: ['src', 'node_modules']
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(dir, 'src'),
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(dir, 'node_modules'),
          path.resolve(dir, 'src')
        ],
        use: [
          'style-loader',
          'css-loader',
        ]
      },
    ]
  },
  plugins: [
    new HtmlPlugin({
      charset: 'utf-8',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
