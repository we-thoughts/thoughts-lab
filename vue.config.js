// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OutputdirOrganiseWebpackPlugin = require('./build/outputdir-organise-webpack-plugin');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM);

module.exports = {
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, '/src/cloud/wx-cloudfunctions'),
          to: path.join(DIST_DIR, 'cloudfunctions'),
        }
      ]),
      new OutputdirOrganiseWebpackPlugin({
        dist_dir: DIST_DIR,
        env: process.env.NODE_ENV === 'production' ? 'build' : 'dev'
      })
    ]
  }
}
