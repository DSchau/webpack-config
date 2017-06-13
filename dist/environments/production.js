"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin");
const OfflinePlugin = require("offline-plugin");
const NameAllModulesPlugin = require("name-all-modules-plugin");
const path = require("path");
const extractCriticalCSS = new ExtractTextPlugin('style.critical.[hash].css');
const extractCSS = new ExtractTextPlugin('style.[hash].css');
const cssLoader = {
    loader: 'css-loader',
    options: {
        importLoaders: 1,
        minimize: true,
        sourceMap: true
    }
};
const sassLoaders = {
    fallback: 'style-loader',
    use: [cssLoader, {
            loader: 'postcss-loader',
            options: {
                config: path.join(__dirname, './config-files/postcss.config')
            }
        }, 'sass-loader']
};
function productionConfig(config) {
    config.module.rules = config.module.rules.filter(rule => {
        if (rule.test.test) {
            return !rule.test.test('.css') && !rule.test.test('.scss');
        }
        return true;
    });
    return {
        devtool: 'source-map',
        entry: {
            vendor: ['autosize', 'ityped', 'particles.js']
        },
        output: {
            filename: 'scripts/[name].[chunkhash].js',
            publicPath: './'
        },
        module: {
            rules: [
                // presumes all CSS files are critical (e.g. normalize.css, webfont, etc.)
                {
                    test: /\.css$/,
                    use: extractCriticalCSS.extract({
                        fallback: 'style-loader',
                        use: [cssLoader]
                    })
                },
                {
                    test: /critical\.scss$/,
                    use: extractCriticalCSS.extract(sassLoaders)
                },
                {
                    test: /index\.scss$/,
                    use: extractCSS.extract(sassLoaders)
                }
            ]
        },
        plugins: [
            new webpack.NamedChunksPlugin(chunk => {
                if (chunk.name) {
                    return chunk.name;
                }
                return chunk.modules
                    .map(m => path.relative(m.context || __dirname, m.request))
                    .join('_');
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: Infinity
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'runtime',
                minChunks: Infinity
            }),
            extractCriticalCSS,
            extractCSS,
            new StyleExtHtmlWebpackPlugin({
                cssRegExp: /critical.+\.css$/
            }),
            new OfflinePlugin({
                ServiceWorker: {
                    events: true
                }
            }),
            new NameAllModulesPlugin()
        ]
    };
}
exports.default = productionConfig;
