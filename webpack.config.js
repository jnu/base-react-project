/* eslint-env node */
var execSync = require("child_process").execSync;
// Check node version.
var version = execSync("node --version").toString().trim();
if (version !== "v10.11.0") {
    console.log("Requires node v10.11.0 to run. You are using", version, ".");
    process.exit(1);
}

const IgnorePlugin = require("webpack/lib/IgnorePlugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DEBUG = process.env.NODE_ENV !== "production";
const bundleExt = (DEBUG ? "" : ".min") + ".js";

module.exports = {
    entry: {
        "app": "./src/index.tsx",
    },
    mode: DEBUG ? "development" : "production",
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 100000,
                    },
                },
            },
            {
                test: /\.(s*)css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: ["@babel/plugin-syntax-dynamic-import"],
                    }
                }]
            },
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: ["@babel/plugin-syntax-dynamic-import"],
                    }
                }, {
                    loader: "ts-loader"
                }]
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: "./src/layout/index.html",
        }),
        new IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    devtool: DEBUG ? "source-map" : false,
    devServer: {
        port: 5678,
        historyApiFallback: true,
        hot: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                pathRewrite: {"^/api": ""}
            }
        }
    },
    output: {
        publicPath: "/",
        path: path.join(__dirname, "dist"),
        filename: "[name]" + bundleExt,
    },
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
        alias: {
            "src": path.resolve("src")
        },
        modules: [__dirname, "node_modules"]
    }
};
