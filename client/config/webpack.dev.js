var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: 'static/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js'
  },

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});
