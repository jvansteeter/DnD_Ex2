var HtmlWebpackPlugin = require('html-webpack-plugin');
var helpers = require('./helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.css', '.scss']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: {configFileName: helpers.root('tsconfig.json')}
          },
          'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        include: [helpers.root('src', 'resources')],
        loader: 'file-loader?name=resources/[name].[hash].[ext]'
      },
      {
        test: /\.scss$/,
        include: [helpers.root('src', 'app'), helpers.root('src', 'login')],
        loaders: ["raw-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        exclude: [helpers.root('src', 'app'), helpers.root('src', 'login')],
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.css$/,
        include: [helpers.root('src', 'app'), helpers.root('src', 'login'), helpers.root('src', 'resources')],
        use: 'raw-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'client/index.html',
      chunks: ['app', 'vendor', 'polyfills']
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: 'client/login.html',
      chunks: ['login', 'vendor', 'polyfills']
    }),
		new CopyWebpackPlugin([{
			from: helpers.root('src', 'resources'),
			to: 'resources/[path]/[name].[ext]',
			toType: 'template'
		}], {
			copyUnmodified: true
		}),
	  new CopyWebpackPlugin([{
	    from: 'node_modules/@angular/material/prebuilt-themes/indigo-pink.css',
		  to: 'resources/styles/[name].[ext]',
		  toType: 'template'
	  }]),
	  new CopyWebpackPlugin([{
		  from: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
		  to: 'resources/styles/[name].[ext]',
		  toType: 'template'
	  }]),
	  new CopyWebpackPlugin([{
	  	from: './package.json',
		  to: './../',
		  toFrom: 'template'
	  }])
  ]
};

