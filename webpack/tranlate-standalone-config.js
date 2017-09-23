'use strict';

module.exports = function () {
	const utils = require('./utils');
	const env = process.env.NODE_ENV || 'development';
	const config = utils.loadConfigFile(env, __dirname + '/../conf');
	config.env = config.env || {};
	config.env.NODE_ENV = env;

	const deepExtend = require('deep-extend');
	const HtmlWebpackPlugin = require('html-webpack-plugin');
	const path = require('path');
	const webpack = require('webpack');
	const DefinePlugin = require('webpack/lib/DefinePlugin');
	const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
	const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
	const IgnorePlugin = require('webpack/lib/IgnorePlugin');
	const CopyWebpackPlugin = require('copy-webpack-plugin');
	const ExtractTextPlugin = require('extract-text-webpack-plugin');
	const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
	const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
	const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
	const CleanWebpackPlugin = require('clean-webpack-plugin');
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

	const TranslatePlugin = require('./translate-plugin');

	const rootDir = path.resolve(__dirname, '..');
	const app = 'app';
	const dist = 'dist';

	return {
		entry: {
			css: [path.resolve(rootDir, app, 'app.module.scss')]
		},
		module: {},
		output: {
			filename: 'ignore',
			path: path.resolve(rootDir, dist),
			publicPath: !!config.env.baseUrl ? config.env.baseUrl : undefined
		},
		plugins: [
			new IgnorePlugin(/scss/),
			new TranslatePlugin({
				"dynamic-i18n": {
					conf: config.dynamicI18n.locale
				}
			}),
			new TranslatePlugin({
				"dynamic-i18n": {
					conf: config.dynamicI18n.dictionary
				}
			})
		],
		resolve: {
			extensions: ['.scss']
		},
	};
};
