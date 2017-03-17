const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')


const PORT = 3000

const PATHS = {
  app: path.resolve(__dirname),
  build: path.resolve(__dirname, 'build'),
  jssStyled: path.resolve(__dirname, '../../src'),
}

module.exports = {
  entry: [
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',

    path.join(PATHS.app, 'index.jsx'),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          PATHS.app,
          PATHS.jssStyled,
        ],
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new HtmlWebpackPlugin({
      template: path.join(PATHS.app, 'index.html'),
    }),
    new webpack.NamedModulesPlugin(),
  ],
  output: {
    path: PATHS.build,
    filename: 'js/bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: PATHS.app,
    port: PORT,
    hot: true,

    stats: true,
  },
}
