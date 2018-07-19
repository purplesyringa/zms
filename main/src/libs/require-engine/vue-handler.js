import normalizeComponent from "vue-loader/lib/component-normalizer";
import addStylesClient from "vue-style-loader/lib/addStylesClient";


export default function vueHandler(ex) {
	return normalizeComponent(
		ex.default.mExports,
		{
			render: ex.default.render,
			staticRenderFns: ex.default.staticRenderFns
		},
		false,
		() => addStylesClient(
			ex.default.options.scopeId,
			ex.default.allCss,
			true,
			ex.default.options
		),
		ex.default.options.scopeId,
		null
	).exports;
}