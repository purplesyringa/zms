export default function pluginUtilHandler(ex) {
	const matched = this.prefix.match(/^plugins\/(.*)\/$/);
	if(!matched) {
		throw new Error("plugin-util can only be used from plugin");
	}

	return ex.default(unescape(matched[1]));
}