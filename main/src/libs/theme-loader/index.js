import {zeroPage} from "../../route.js";
import Vue from "vue/dist/vue.min.js";
import httpVueLoader from "http-vue-loader";

// Replace fetch() and XMLHttpRequest
async function setUpFetch() {
	// Get ajaxkey
	const ajax = await zeroPage.cmd("wrapperGetAjaxKey");

	const oldFetch = window.fetch;
	window.fetch = (url, ...args) => oldFetch(`${url}?ajax_key=${ajax}`, ...args);

	// Replace XMLHttpRequest
	const oldOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function(method, url, ...args) {
		return oldOpen.call(this, method, `${url}?ajax_key=${ajax}`, ...args)
	};
}

import {configCss} from "./css.js";
import {configJs} from "./js.js";
(async function() {
	await setUpFetch();

	await configCss();
	await configJs();

	console.log(await httpVueLoader("theme/list.vue"));
})();