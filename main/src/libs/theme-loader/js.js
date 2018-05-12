import {transform} from "@babel/standalone";
import httpVueLoader from "http-vue-loader";

export function configJs() {
	httpVueLoader.langProcessor.js = code => {
		return transform(code, {
			presets: ["es2015"]
		}).code;
	};
}