import { resolve } from 'path';
import MinifyPlugin from 'babel-minify-webpack-plugin';

const PRODUCTION = process.env.NODE_ENV === 'production';

export default {
	entry: './src/index.js',
	output: {
		filename: 'backend.solid.min.js',
		path: resolve(__dirname, 'dist'),
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
		new MinifyPlugin(),
	],
};
