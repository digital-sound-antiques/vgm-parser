const path = require('path');

module.exports = {
  mode: 'production',
  entry: './dist/index.js',
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'bundle.js',
    library: "VGM",
    libraryTarget: "var",
    libraryExport: "VGM",
  }
};
