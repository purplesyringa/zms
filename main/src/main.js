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

import Theme from "./libs/theme";
import {FileNotFoundError} from "./libs/require-engine";
(async function() {
	try {
		await Theme.loadTheme();
	} catch(e) {
		if(e instanceof FileNotFoundError) {
			console.log("Theme file not found:", e.message);
			route(app);
			setTimeout(() => {
				app.$router.navigate(`500/theme-file-missing/${btoa(e.message)}`);
			}, 1000);
			return;
		} else {
			throw e;
		}
	}

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