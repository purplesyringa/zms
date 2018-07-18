import "./sass/main.sass";

import Vue from "vue/dist/vue.min.js";

import AsyncComputed from "vue-async-computed";
Vue.use(AsyncComputed);

import VueVisible from "vue-visible";
Vue.use(VueVisible);

import VueWysiwyg from "vue-wysiwyg";
import "vue-wysiwyg/dist/vueWysiwyg.css";

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

import Theme, {ThemeFileNotFoundError} from "./libs/theme";
(async function() {
	// Patch XHR
	const realOpen = XMLHttpRequest.prototype.open;
	const key = await zeroPage.cmd("wrapperGetAjaxKey");
	XMLHttpRequest.prototype.open = function(method, url, async) {
		if(!url.startsWith("data:")) {
			url += `?ajax_key=${key}`;
		}
		return realOpen.call(this, method, url, async);
	};

	try {
		await Theme.loadTheme();

		const manifest = await Theme.getManifest();
		if(manifest.wysiwyg) {
			Vue.use(VueWysiwyg, manifest.wysiwyg);
		}
	} catch(e) {
		if(e instanceof ThemeFileNotFoundError) {
			console.log("Theme file not found:", e.message);
			route(app);
			app.$router.navigate(`500/theme-file-missing/${btoa(e.message)}`);
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