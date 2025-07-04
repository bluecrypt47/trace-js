const path = require('path');

module.exports = {
  entry: './front-end/index.js',
  output: {
    path: path.resolve(__dirname, 'front-end'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  optimization: {
    minimize: false, 
  },
  resolve: {
    extensions: ['.js']
  }
};