const path = require("path");

const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
	context: path.resolve(__dirname, "./src"),
	entry: {
		main: ["babel-polyfill", "./main.js"]
	},
	node: {
		fs: "empty"
	},
	output: {
		path: path.resolve(__dirname, "./dist"),
		publicPath: "./",
		filename: "[name].js"
	},
	externals: {
		ZMSStore: "ZMSStore"
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					loaders: {
						scss: "vue-style-loader!css-loader!sass-loader",
						sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax",
					}
				}
			},
			{
				test: /\.css$/,
				loader: "style-loader!css-loader"
			},
			{
				test: /\.s[ac]ss$/,
				loader: "style-loader!css-loader!sass-loader?indentedSyntax"
			},
			{
				test: /\.js$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["env"],
							plugins: [
								[
									"babel-plugin-transform-builtin-extend", {
										globals: ["Error", "Array"]
									}
								],
								"transform-class-properties",
								"transform-async-generator-functions"
							]
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["env"],
							plugins: [
								[
									"babel-plugin-transform-builtin-extend", {
										globals: ["Error", "Array"]
									}
								],
								"transform-class-properties",
								"transform-async-generator-functions"
							]
						}
					}
				],
				include: /vue-awesome|http-vue-loader/
			},
			{
				test: /\.(gif|jpe?g|png)$/,
				loader: "file-loader"
			},
			{
				test: /\.svg$/,
				loader: "url-loader",
				options: {
					mimetype: "image/svg+xml"
				}
			},
			{
				test: /\.(ttf|otf|eot|woff2?)$/,
				loader: "file-loader?name=fonts/[name].[ext]"
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "ZMS",
			template: "./index.html",
			seo: {
				keywords: "press,zms,zeronet,cms",
				description: "ZeroNet Management System"
			}
		}),
		new CopyWebpackPlugin([
			{
				from: "./dbschema.json",
				to: "./dbschema.json"
			}
		]),
		new CopyWebpackPlugin([
			{
				from: "./content.json",
				to: "./content.json"
			}
		]),
		new CopyWebpackPlugin([
			{
				from: "./data",
				to: "./data"
			}
		]),
		new BundleAnalyzerPlugin(),
		new UglifyJSPlugin(),

		// Move node_modules to separate pack
		new webpack.optimize.CommonsChunkPlugin({
			name: "corejs",
			minChunks: module => /node_modules/.test(module.resource || "")
		}),

		// Move out core-js
		new webpack.optimize.CommonsChunkPlugin({
			name: "vue",
			minChunks: module => !/core-js/.test(module.resource || "")
		}),

		// Move out vue
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks: module => !/vue\.min\.js/.test(module.resource || "")
		})
	]
};