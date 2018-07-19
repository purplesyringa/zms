export default siteInfo => {
	return [
		{
			role: "admin",
			name: "Admin",
			description: "Changes user roles, site settings. Can do anything moderator can do.",
			static: true,
			autoGranted: true
		},
		{
			role: "moderator",
			name: "Moderator",
			description: "Edits other authors' content. If comments are enabled, can also edit them. Can do anything author can do.",
			static: !siteInfo.settings.own
		},
		{
			role: "author",
			name: "Author",
			description: "Creates posts. Can do anything user can do."
		},
		{
			role: "user",
			name: "User",
			description: "Creates comments, votes, depending on plugins.",
			default: true
		},
		{
			role: "banned",
			name: "Banned",
			description: "Can only read blog, not post anything, even comments/votes."
		}
	];
};