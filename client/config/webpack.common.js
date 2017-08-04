var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
  entry: {
    'polyfills': './client/src/polyfills.ts',
    'vendor': './client/src/vendor.ts',
    'app': './client/src/main.ts',
    'login': './client/src/login.ts'
  },

  resolve: {
    extensions: ['.ts', '.js', '.css']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('tsconfig.json') }
          },
          'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      //   loader: 'file-loader?name=resources/[name].[hash].[ext]'
      // },
      // {
      //   test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|css)$/,
      //   exclude: [helpers.root('src', 'app'), helpers.root('src', 'login')],
      //   loader: 'file-loader?name=resources/[name].[hash].[ext]'
      // },
      {
        test: /\.css$/,
        exclude: [helpers.root('src', 'app'), helpers.root('src', 'login')],
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap' })
      },
      {
        test: /\.css$/,
        include: [helpers.root('src', 'app'), helpers.root('src', 'login')],
        loader: 'raw-loader'
      },
      // {
      //   test: /\.css$/,
      //   include: helpers.root('src', 'login'),
      //   loader: 'raw-loader'
      // }
    ]
  },

  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('.client/src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.optimize.CommonsChunkPlugin({
      // name: ['vendor', 'polyfills'],
        children: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'client/index.html',
      chunks: ['app']
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: 'client/login.html',
      chunks: ['login']
    }),
    new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery'
    }),
    new CopyWebpackPlugin([
        {from : helpers.root('src', 'resources'), to: 'resources'}
    ])
  ]
};

