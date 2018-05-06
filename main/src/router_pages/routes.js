import Home from "./home/home.vue";
import Post from "./post/post.vue";
import AdminRoot from "./admin/root.vue";

export default vue => [
	{
		path: "",
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
	}
];