const path = require("path");

const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const BABEL = {
	loader: "babel-loader",
	options: {
		presets: ["env", "stage-0"],
		plugins: [
			"syntax-decorators",
			"transform-decorators-legacy",
			[
				"babel-plugin-transform-builtin-extend", {
					globals: ["Error", "Array"]
				}
			],
			"transform-class-properties"
		]
	}
};

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
						js: BABEL
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
					BABEL
				],
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				use: [
					BABEL
				],
				include: /vue-awesome|http-vue-loader|zero-dev-lib/
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
			name: "vue-awesome-brands-ak",
			minChunks: module => !/vue\.min\.js/.test(module.resource || "")
		}),

		// Move out vue-awesome brands from A to K
		new webpack.optimize.CommonsChunkPlugin({
			name: "vue-awesome-brands-lz",
			minChunks: module => !/vue-awesome.*brands[/\\][a-k].*/.test(module.resource || "")
		}),

		// Move out vue-awesome brands
		new webpack.optimize.CommonsChunkPlugin({
			name: "vue-awesome-regular",
			minChunks: module => !/vue-awesome.*brands/.test(module.resource || "")
		}),

		// Move out vue-awesome regular
		new webpack.optimize.CommonsChunkPlugin({
			name: "vue-awesome-ak",
			minChunks: module => !/vue-awesome.*regular/.test(module.resource || "")
		}),

		// Move out vue-awesome icons from A to K
		new webpack.optimize.CommonsChunkPlugin({
			name: "vue-awesome-lz",
			minChunks: module => !/vue-awesome[/\\]icons[/\\][a-k].*/.test(module.resource || "")
		}),

		// Move out vue-awesome
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks: module => !/vue-awesome/.test(module.resource || "")
		})
	]
};