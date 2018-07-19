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
			"transform-class-properties",
			"transform-object-rest-spread"
		]
	}
};

let chunks = require("./chunks").map(obj => {
	const chunk = Object.keys(obj)[0];
	return {
		chunk,
		regexp: obj[chunk]
	};
});
let chunkPlugins = [];

for(let i = 0; i < chunks.length; i++) {
	const name = (chunks[i + 1] || {chunk: "entry"}).chunk;
	const regexp = chunks[i].regexp;
	chunkPlugins.push(
		new webpack.optimize.CommonsChunkPlugin({
			name,
			minChunks: module => !regexp.test(module.resource || "")
		})
	);
}

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

		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	].concat(chunkPlugins)
};