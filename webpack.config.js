var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    main: [ './client/main/main.js', './client/main/scss/style.scss' ],
    dashboard: './client/dashboard/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract([
          'css-loader',
          'sass-loader'
        ])
      },
      {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract([
          'css-loader',
          'sass-loader'
        ])
      },
      {
        test: /\.(woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options: {
          limit: 5000,
          mimetype: "application/font-woff",
          name: "./fonts/[name].[ext]",
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin({ // define where to save the file
      filename: '[name].bundle.css',
      allChunks: true,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      Popper: ['popper.js', 'default'],
     })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
