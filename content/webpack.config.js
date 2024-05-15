const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const fs = require('fs');

module.exports = {
  entry: getEntryPoints(),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'compile-extension')
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src',
          to({ absoluteFilename }) {
            return absoluteFilename.replace(/\.\./g, '.');
          },
          globOptions: {
            ignore: ['**/*.js']
          }
        }
      ]
    })
  ]
};

function getEntryPoints() {
  const entryPoints = {};
  const srcPath = path.resolve(__dirname, 'src');
  const files = fs.readdirSync(srcPath);

  files.forEach(file => {
    const filePath = path.resolve(srcPath, file);
    if (fs.statSync(filePath).isFile() && path.extname(file) === '.js') {
      const entryName = path.basename(file, '.js');
      entryPoints[entryName] = filePath;
    }
  });

  return entryPoints;
}