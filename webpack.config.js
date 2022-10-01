const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/js/scripts.js',
    output: {
        path: path.resolve(__dirname, './src/dist'),
        filename: 'index.bundle.js',
    },
};