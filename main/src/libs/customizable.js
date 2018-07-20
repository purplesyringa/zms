import Settings from "./settings";


class Customizable {
	constructor() {
		this.widgets = {};
	}

	async getWidgets(name) {
		return await Settings.get(`customizable.widgets.${name}`, []);
	}

	async add(name, plugin, widgetName) {
		let widgets = await Settings.get(`customizable.widgets.${name}`, []);
		widgets.push({plugin, widgetName});
		await Settings.set(`customizable.widgets.${name}`, widgets);
		return widgets;
	}

	registerWidget(plugin, widget, fileName) {
		let scopes = widget.scope;
		if(typeof scopes === "string") {
			scopes = [scopes];
		}

		for(const scope of scopes) {
			if(!this.widgets[scope]) {
				this.widgets[scope] = {};
			}
			if(!this.widgets[scope][plugin]) {
				this.widgets[scope][plugin] = {};
			}

			this.widgets[scope][plugin][widget.title] = {widget, fileName};
		}
	}

	getWidget(scope, plugin, widgetName) {
		return this.widgets[scope][plugin][widgetName];
	}

	getPossibleWidgets(scope) {
		return this.widgets[scope];
	}
};


export default new Customizable();