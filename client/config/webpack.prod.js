var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

var ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
	mode: 'production',

	output: {
		path: helpers.root('dist'),
		publicPath: 'static/',
		filename: '[name].[hash].js',
		chunkFilename: '[id].[hash].js'
	}
});

