var path = require('path');

const webpack = require('webpack');

config = {

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel',
      },
      {
        test: /\.(png|jpg|svg|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file?name=[path][name].[ext]'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?name=[path][name].[ext]&limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
    ]
  },

  vue: {
    esModule: true,
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
  ],

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['', '.js', '.vue', '.json', '.min.js'],
    alias: {
      spec_helper: path.join(__dirname, 'test', 'spec_helper'),
      vue: path.join(__dirname, 'node_modules', 'vue', 'dist', 'vue.js'),
    }
  },
}

module.exports = config;
