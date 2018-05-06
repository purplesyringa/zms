import Home from "./home/home.vue";
import AdminRoot from "./admin/root.vue";

export default vue => [
	{
		path: "",
		controller: () => {
			vue.currentView = Home;
		}
	},
	{
		path: "admin",
		controller: () => {
			vue.currentView = AdminRoot;
			return false;
		}
	},
	{
		path: "admin/:page",
		controller: () => {
			vue.currentView = AdminRoot;
			return false;
		}
	},
	{
		path: "admin/:page/:subpage",
		controller: () => {
			vue.currentView = AdminRoot;
			return false;
		}
	}
];