const path = require('path');
const webpack = require('webpack');

const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'backend.solid.min.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/live/',
	},
	module: {
		rules: [
			{
				loader: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/,
			},
			{
				loader: 'babel-loader',
				test: [
					/webcrypto/,
					/oidc-rp/,
				],
			},
		],
	},
	node: {
		fs: 'empty',
		child_process: 'empty',
	},
	externals: {
		'Mavo': 'Mavo',
		'node-fetch': 'fetch',
		'text-encoding': 'TextEncoder',
		'urlutils': 'URL',
		'@trust/webcrypto': 'crypto',
	},
	devtool: PRODUCTION ? 'source-map' : 'eval-source-map',
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			minimize: PRODUCTION,
		}),
	],
};
