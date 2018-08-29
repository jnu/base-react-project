/* eslint-env node */
var execSync = require('child_process').execSync;
// Check node version.
var version = execSync('node --version').toString().trim();
if (version !== 'v10.6.0') {
    console.log("Node v10.6.0 required to run. You are using", version, ".");
    process.exit(1);
}

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DEBUG = process.env.NODE_ENV !== 'production';

const bundleExt = (DEBUG ? '' : '.min') + '.js';


module.exports = {
    entry: {
        'app': './src/index.tsx',
    },
    mode: DEBUG ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/env', '@babel/react'],
                    }
                }]
            },
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/env', '@babel/react'],
                    }
                }, {
                    loader: 'ts-loader'
                }]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: './src/layout/index.html',
        }),
    ],
    devtool: DEBUG ? 'source-map' : false,
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      overlay: {
        warnings: false,
        errors: true
      }
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]' + bundleExt,
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
        modules: [__dirname, 'node_modules']
    }
};
