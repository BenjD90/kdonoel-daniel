'use strict';

module.exports = function (env, conf) {
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
		devtool: 'source-map',
		entry: {
			app: [path.resolve(rootDir, app, 'main')],
			vendor: [path.resolve(rootDir, app, 'vendor')],
			css: [path.resolve(rootDir, app, 'app.module.scss')]
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					enforce: 'pre',
					loader: 'tslint-loader',
					options: {
						typeCheck: false,
					}
				},
				{
					test: /\.html$/,
					exclude: /index\.html/,
					loader: 'raw-loader'
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
				},
				{
					test: /app\.module\.scss$/,
					use: ExtractTextPlugin.extract({
						use: [
							'css-loader?sourceMap',
							'sass-loader?sourceMap'
						]
					})
				},
				{
					test: /\.(png|jpe?g|gif|ico|svg)$/,
					loader: 'file-loader?name=[name].[hash].[ext]'
				},
				{
					test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader?limit=10000&mimetype=application/font-woff'
				},
				{
					test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader?limit=10000&mimetype=application/font-woff'
				},
				{
					test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
				},
				{
					test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'file-loader'
				},
				{
					test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
					loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
				}
			]
		},
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(rootDir, dist),
			publicPath: !!conf.env.baseUrl ? conf.env.baseUrl : undefined
		},
		plugins: [
			new CommonsChunkPlugin({
				filename: 'vendor.bundle.js',
				minChunks: Infinity,
				name: 'vendor'
			}),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				inject: 'body',
				template: path.resolve(rootDir, app, 'index.html'),
				env: conf.env
			}),
			new ExtractTextPlugin({
				filename: "styles.css",
				disable: false,
				allChunks: true
			}),
			new LoaderOptionsPlugin({
				debug: false
			}),
			new ContextReplacementPlugin(
				/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
				__dirname
			),
			new DefinePlugin({
				'process.env': JSON.stringify(conf.env || {})
			}),
			new CopyWebpackPlugin([
				{context: app, from: "**/*.+(png|jpeg|jpg|gif|ico|svg)"}
			]),
			new SimpleProgressWebpackPlugin({ // Default options
				format: 'compact'
			}),
			new HotModuleReplacementPlugin(),
			//ignore moment locales
			// new IgnorePlugin(/^\.\/locale$/, /moment$/),
			//prevent from importing lodash global module
			//new IgnorePlugin(/^lodash$/),
			//prevent from importing rxjs global module
			new IgnorePlugin(/^rxjs$/),
			new CleanWebpackPlugin([dist], {
				root: rootDir
			}),
			// uncomment to analyse bundles
			// new BundleAnalyzerPlugin({
			// 	// Can be `server`, `static` or `disabled`.
			// 	// In `server` mode analyzer will start HTTP server to show bundle report.
			// 	// In `static` mode single HTML file with bundle report will be generated.
			// 	// In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
			// 	analyzerMode: 'server',
			// 	// Host that will be used in `server` mode to start HTTP server.
			// 	analyzerHost: '127.0.0.1',
			// 	// Port that will be used in `server` mode to start HTTP server.
			// 	analyzerPort: 8180,
			// 	// Path to bundle report file that will be generated in `static` mode.
			// 	// Relative to bundles output directory.
			// 	reportFilename: 'report.html',
			// 	// Module sizes to show in report by default.
			// 	// Should be one of `stat`, `parsed` or `gzip`.
			// 	// See "Definitions" section for more information.
			// 	defaultSizes: 'parsed',
			// 	// Automatically open report in default browser
			// 	openAnalyzer: false,
			// 	// If `true`, Webpack Stats JSON file will be generated in bundles output directory
			// 	generateStatsFile: false,
			// 	// Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
			// 	// Relative to bundles output directory.
			// 	statsFilename: 'stats.json',
			// 	// Options for `stats.toJson()` method.
			// 	// For example you can exclude sources of your modules from stats file with `source: false` option.
			// 	// See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
			// 	statsOptions: null,
			// 	// Log level. Can be 'info', 'warn', 'error' or 'silent'.
			// 	logLevel: 'info'
			// }),
			new TranslatePlugin({
				"dynamic-i18n": {
					conf: conf.dynamicI18n.locale
				}
			})
		],
		resolve: {
			extensions: ['.js', '.ts', '.scss']
		},
		devServer: deepExtend(
			{},
			{
				inline: true,
				noInfo: true,
				historyApiFallback: true
			},
			conf.webpackDevServer || {}
		)
	};
};
