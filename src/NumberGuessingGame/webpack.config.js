// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
// hack https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167#issuecomment-976836861
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// This webpack is only for build Sass to CSS
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  // https://webpack.js.org/configuration/entry-context/#entry
  entry: {
    [`wwwroot/scripts/site`]: './src/main',
    [`wwwroot/styles/site`]: './src/scss/style',

  },
  mode: 'development', // check if we need it for hot reload
  output: {
    path: __dirname, // Output dir must be absolute path
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          // Extract code to an external CSS file.
          MiniCssExtractPlugin.loader,
          // Translates CSS to CommonJS and ignore solving URL of images
          {
            loader: 'css-loader',
            options: {
              // Set to false, css-loader will not parse any paths specified in url or image-set.
              // For more details, please refer to https://webpack.js.org/loaders/css-loader/#url.
              url: false
            }
          },
          // Compile Sass to CSS.
          'sass-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    react: 'React'
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: 'inline-source-map',
};

const configWithTimeMeasures = new SpeedMeasurePlugin().wrap(config);
configWithTimeMeasures.plugins.push(new MiniCssExtractPlugin({
  // Configure the output of CSS.
  // It is relative to output dir, only relative path work, absolute path does not work.
  filename: "[name].css",
}));
configWithTimeMeasures.plugins.push(new RemoveEmptyScriptsPlugin({ verbose: true }));

module.exports = configWithTimeMeasures;
