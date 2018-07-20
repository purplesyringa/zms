import "./sass/main.sass";

import Vue from "vue/dist/vue.min.js";

import AsyncComputed from "vue-async-computed";
Vue.use(AsyncComputed);

import VueVisible from "vue-visible";
Vue.use(VueVisible);

import VueTrumbowyg from "vue-trumbowyg";
import "trumbowyg/dist/ui/trumbowyg.css";
Vue.use(VueTrumbowyg);


import Icon from "vue-awesome/components/Icon.vue";
Vue.component("icon", Icon);
import "vue-awesome/icons";

import Customizable from "./vue_components/customizable.vue";
Vue.component("customizable", Customizable);


const $global = new Vue({
	data: {
		customizableManaged: false
	}
});
Vue.use({
	install() {
		Object.defineProperty(Vue.prototype, "$global", {
			get() {
				return $global
			}
		})
	}
});

Vue.prototype.$eventBus = new Vue();

import root from "./vue_components/root.vue";
var app = new Vue({
	el: "#app",
	render: h => h(root),
	data: {
		currentView: null,
		zeroPage: null
	}
});

import {route} from "./route.js";
import {zeroPage} from "./zero";

import ZeroHTTPRequest from "./zero-http-request";
window.XMLHttpRequest = ZeroHTTPRequest;

import * as ConsoleHook from "./console-hook";

import Theme from "./libs/theme";
import {FileNotFoundError} from "./libs/require-engine";
(async function() {
	const own = (await zeroPage.getSiteInfo()).settings.own;

	if(own) {
		ConsoleHook.install();
	}

	try {
		await Theme.loadPlugins();
	} catch(e) {
		if(e instanceof FileNotFoundError) {
			console.log("Plugin file not found:", e.message);
			require("./sass/default.sass");
			route(app);
			setTimeout(() => {
				const plugin = unescape(e.message.replace(/$\.\/src\/plugins\//, "").split("/")[0]);
				app.$router.navigate(`500/plugin-file-missing/${btoa(plugin)}/${btoa(e.message)}`);
			}, 1000);
			ConsoleHook.uninstall();
			return;
		} else {
			console.error(e);
			ConsoleHook.uninstall();
			throw e;
		}
	}

	try {
		await Theme.loadTheme();
	} catch(e) {
		if(e instanceof FileNotFoundError) {
			console.log("Theme file not found:", e.message);
			require("./sass/default.sass");
			route(app);
			setTimeout(() => {
				app.$router.navigate(`500/theme-file-missing/${btoa(e.message)}`);
			}, 1000);
			ConsoleHook.uninstall();
			return;
		} else {
			console.error(e);
			ConsoleHook.uninstall();
			throw e;
		}
	}

	ConsoleHook.uninstall();

	route(app);
})();

Vue.prototype.$zeroPage = zeroPage;

let currentSiteInfo;
(async function() {
	const siteInfo = await zeroPage.getSiteInfo();
	currentSiteInfo = siteInfo;
	app.$eventBus.$emit("setSiteInfo", siteInfo);
})();
zeroPage.on("setSiteInfo", msg => {
	currentSiteInfo = msg.params;
	app.$eventBus.$emit("setSiteInfo", msg.params);
});

app.$eventBus.$on("needSiteInfo", async () => {
	if(currentSiteInfo) {
		app.$eventBus.$emit("setSiteInfo", currentSiteInfo);
	}
});