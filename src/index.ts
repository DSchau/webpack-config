import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as assign from 'webpack-config-assign';
import * as omit from 'object.omit';

import * as path from 'path';
import * as fs from 'fs';


import getConfig from './util/get-config';

const getUrlLoader = (environment, options) => {
  return [
    {
      loader: 'url-loader',
      options
    }
  ];
};

const hasFile = name => {
  return fs.existsSync(path.resolve(name));
}

export function getWebpackConfig(...extendConfigs) {
  return function config({ environment = 'production' } = {}) {
    const urlLoader = getUrlLoader.bind(undefined, environment);
    return assign(
      {
        entry: omit({
          bundle: path.resolve('src/index'),
          polyfills: path.resolve('src/polyfills')
        }, (filePath, key) => hasFile(`${filePath}.js`)),
        output: {
          path: path.resolve('dist'),
          filename: '[name].js',
          publicPath: '/'
        },
        resolve: {
          alias: {
            static: path.resolve('static')
          }
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              use: 'babel-loader',
              include: path.resolve('src')
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader']
            },
            {
              test: /\.scss$/,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    config: {
                      path: path.join(
                        __dirname,
                        './config-files/postcss.config'
                      )
                    }
                  }
                },
                'sass-loader'
              ]
            },
            {
              test: /\.pug|jade$/,
              use: ['pug-loader']
            },
            {
              test: /\.jpe?g|png|gif|webp$/,
              use: urlLoader({
                limit: 2500,
                name: './assets/images/[name].[hash].[ext]'
              }),
              include: path.resolve('static')
            },
            {
              test: /\.woff2?$/,
              use: urlLoader({
                limit: 2500,
                mimetype: 'application/font-woff',
                name: './assets/fonts/[hash].[ext]',
                publicPath: ''
              })
            },
            {
              test: /\.ttf$/,
              use: urlLoader({
                limit: 10000,
                mimetype: 'application/octet-stream',
                name: './assets/fonts/[hash].[ext]'
              })
            },
            {
              test: /\.eot$/,
              use: urlLoader({
                limit: 5000,
                mimetype: 'image/svg+xml',
                name: './assets/fonts/[hash].[ext]'
              })
            },
            {
              test: /\.svg$/,
              use: urlLoader({
                limit: 5000,
                mimetype: 'image/svg+xml',
                name: './assets/fonts/[hash].[ext]'
              }),
              include: [path.resolve('src/assets/web-font')]
            },
            {
              test: /manifest\.json$/,
              use: 'file-loader',
              include: [path.resolve('static')]
            }
          ]
        },
        plugins: [
          new HtmlWebpackPlugin({
            chunksSortMode(a, b) {
              const order = ['runtime', 'vendor', 'polyfills', 'bundle'];
              return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
            },
            inject: 'body',
            template: 'public/index.pug'
          }),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
              process.env.NODE_ENV || environment
            )
          }),
          new webpack.NamedModulesPlugin()
        ],
        stats: {
          children: false
        }
      },
      getConfig(environment),
      ...extendConfigs
    );
  };
}
