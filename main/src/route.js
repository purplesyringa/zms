import {zeroPage, zeroAuth} from "./zero";

import Vue from "vue/dist/vue.min.js";
import VueRouter from "./libs/vuerouter.js";
const router = VueRouter(zeroPage);
Vue.use(router.plugin);

zeroPage.on("wrapperPopState", res => router.router.listenForBack(res.params));

import Routes from "./router_pages/routes.js";
export const route = async vue => {
	const routes = Routes(vue, zeroPage);

	routes.forEach(route => {
		router.router.add({
			path: route.path,
			controller(params) {
				const oldView = vue.currentView;

				if(route.controller(params) !== false) {
					if(oldView == vue.currentView) {
						vue.currentView = null;
						vue.$nextTick(() => vue.currentView = oldView);
					}
				}

				vue.$eventBus.$emit("navigate");
			}
		});
	});

	await zeroAuth.getAuthAsync(); // Some pages use zeroAuth.getAuth()
	router.router.check(router.router.getURL());
};