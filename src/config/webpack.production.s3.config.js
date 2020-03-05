/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

/* eslint-disable import/no-extraneous-dependencies */
// Disabled due webpack plugins being dev dependencies

// TODO: merge Webpack config files

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { InjectManifest } = require('workbox-webpack-plugin');

const webmanifestConfig = require('./webmanifest.config');
const BabelConfig = require('./babel.config');
const { I18nPlugin, mapTranslationsToConfig } = require('./I18nPlugin');

const projectRoot = path.resolve(__dirname, '..', '..');
const publicRoot = path.resolve(projectRoot, 'build-s3', 'prod');

const staticVersion = Date.now();
const publicPath = '/';

const webpackConfig = ([lang, translation]) => ({
    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.scss',
            '*'
        ]
    },

    cache: false,

    stats: {
        warnings: false
    },

    entry: [
        path.resolve(projectRoot, 'src', 'app', 'index.js')
    ],

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: BabelConfig
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                autoprefixer,
                                cssnano({
                                    preset: ['default', { discardComments: { removeAll: true } }]
                                })
                            ]
                        }
                    },
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: path.resolve(projectRoot, 'src', 'app', 'style', 'abstract', '_abstract.scss')
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            }
        ]
    },

    output: {
        filename: `${lang}.bundle.js`,
        path: path.resolve(publicRoot),
        pathinfo: true,
        publicPath
    },

    plugins: [
        new InjectManifest({
            swSrc: path.resolve(publicRoot, 'sw-compiled.js'),
            swDest: path.resolve(publicRoot, 'sw.js'),
            exclude: [/\.phtml/]
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(projectRoot, 'src', 'public', 'index.production.html'),
            filename: 'index.html',
            inject: false,
            hash: true,
            publicPath,
            chunksSortMode: 'none'
        }),

        new WebpackPwaManifest(webmanifestConfig(projectRoot)),

        new webpack.DefinePlugin({
            'process.env': {
                REBEM_MOD_DELIM: JSON.stringify('_'),
                REBEM_ELEM_DELIM: JSON.stringify('-'),
                MAGENTO_STATIC_VERSION: staticVersion
            }
        }),

        new webpack.ProvidePlugin({
            React: 'react'
        }),

        new I18nPlugin({
            translation
        }),

        new CopyWebpackPlugin([
            { from: path.resolve(projectRoot, 'src', 'public', 'assets'), to: './assets' }
        ]),

        new MinifyPlugin({
            removeConsole: false,
            removeDebugger: true
        }, {
            comments: false
        })
    ]
});

module.exports = mapTranslationsToConfig(['en_US'], webpackConfig);
