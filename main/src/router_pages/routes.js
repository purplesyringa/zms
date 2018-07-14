import Home from "./home/home.vue";
import Post from "./post/post.vue";
import AdminRoot from "./admin/root.vue";
import ThemeFileMissing from "./500/theme-error/theme-file-missing.vue";

export default vue => [
	{
		path: "",
		controller: () => {
			vue.currentView = Home;
		}
	},
	{
		path: "page/:page",
		controller: () => {
			vue.currentView = Home;
		}
	},

	{
		path: "posts/:id",
		controller: () => {
			vue.currentView = Post;
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
	},
	{
		path: "admin/:page/:subpage/:arg",
		controller: () => {
			vue.currentView = AdminRoot;
			return false;
		}
	},

	{
		path: "500/theme-file-missing/:base64",
		controller: () => {
			vue.currentView = ThemeFileMissing;
			return false;
		}
	}
];