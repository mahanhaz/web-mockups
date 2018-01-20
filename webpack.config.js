const path = require('path')
const glob = require('glob')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
require('autoprefixer')
require('webpack')

const clientDirectory = path.resolve(__dirname, './app')
const outputDirectory = path.resolve(__dirname, 'built')

const srcDirectory = path.join(clientDirectory, 'src')
const appDirectory = path.join(srcDirectory, 'app')

let entry = {}

// load app files dynamicly! less stress and less mistake
for (let jsFile of glob.sync(`${appDirectory}/**/*.js`, {absolute: false})) {
  const entryName = path.basename(jsFile, path.extname(jsFile))

  entry[entryName] = jsFile
}

module.exports = {
  entry: {
    index: path.join(appDirectory, 'index.js')
  },
  output: {
    path: outputDirectory,
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      // using it for build ES6 to ES5
      // for using uglify
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/,
      query: {presets: ['react-app']}
    }, {
      test: /\.(sass|scss)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
      })
    }, {
      test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ttf$/, /\.woff2$/, /\.woff$/, /\.eot$/],
      loader: 'file-loader',
      options: {
        name: '/img/[name].[ext]',
        publicPath: url => (url),
      useRelativePath: false
    }
  }, {
  test: /\.css$/,
    loader: 'style-loader!css-loader'
}, {
  test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
    loader: 'file-loader?name=/src/fonts/[name].[ext]'
}]
},
plugins: [
  new ExtractTextPlugin('src/css/main.css')
],
  stats: { assets: false }
}
