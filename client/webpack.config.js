var path = require("path");
var webpack = require("webpack");
var DotenvPlugin = require("webpack-dotenv-plugin");

module.exports = {
    plugins: [
        new DotenvPlugin({
            sample: "./.env.default",
            path: "./.env"
        })
    ],
    entry: "./index.js",
    output: {
        path: path.join(__dirname, "public"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["es2015", "react"]
                }
            },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader"
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader?limit=100000"
            }
        ]
    }
};
