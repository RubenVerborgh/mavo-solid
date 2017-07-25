const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'backend.solid.min.js',
		path: path.resolve(__dirname, 'dist'),
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
	externals: {
		'Mavo': 'Mavo',
		'node-fetch': 'fetch',
		'text-encoding': 'TextEncoder',
		'urlutils': 'URL',
		'@trust/webcrypto': 'crypto',
	},
	devtool: 'source-map',
	plugins: [
		new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
	],
};
