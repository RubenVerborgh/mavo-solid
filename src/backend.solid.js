(function ($) {
const _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: 'Solid',
	constructor: function () {
		// Allow logging in and reading by default
		this.permissions.on(['login', 'read']);

		// Construct the application's data URL
		const extension = this.format.constructor.extensions[0] || '.json';
		this.url = this.source.replace(/\/?$/, `/${this.mavo.id}${extension}`);
	},

	static: {
		test: function (source) {
			// TODO: Add more reliable test (https://github.com/solid/mavo-solid/issues/1)
			return /^https:\/\/[^/]+\.databox\.me/.test(source);
		},
	},
}));
})(Bliss);
