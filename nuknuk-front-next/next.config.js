const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  resolve: {
    extensions: ['.ts'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
}
