var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

	mode: 'development',

  output: {
    path: helpers.root('../dist/client'),
    publicPath: 'static/',
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
	entry: {
		polyfills: './client/src/polyfills.ts',
		app: './client/src/main.ts',
		login: './client/src/login.ts'
	}
});
