'use strict';

module.exports = function (env, conf) {
	const path = require('path');
	const webpack = require('webpack');
	const DefinePlugin = require('webpack/lib/DefinePlugin');
	const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

	const rootDir = path.resolve(__dirname, '..');
	const app = 'app';
	const dist = 'dist';

	return {
		devtool: 'inline-source-map',
		entry: {
			app: [path.resolve(rootDir, app, 'main')],
			vendor: [path.resolve(rootDir, app, 'vendor')]
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					enforce: "pre",
					loader: 'tslint-loader'
				},
				{
					loader: 'raw-loader',
					test: /\.(css|html)$/
				},
				{
					use: [
						'awesome-typescript-loader',
						'angular2-template-loader',
						'angular2-router-loader'
					],
					test: /\.ts$/,
					exclude: /node_modules/
				},
				{
					test: /\.scss$/,
					use: [
						'raw-loader',
						'sass-loader?sourceMap'
					],
					exclude: /app\.module\.scss$/
				}
			]
		},
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(rootDir, dist)
		},
		plugins: [
			new DefinePlugin({
				'process.env': JSON.stringify(conf.env || {})
			}),
			new LoaderOptionsPlugin({
				debug: false
			}),
		],
		resolve: {
			extensions: ['.js', '.ts']
		}
	};
};

