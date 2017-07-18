(function ($) {
const _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: 'Solid',
	constructor: function () {
		console.log(`Solid: created backend from ${this.source} for ${this.mavo.id}.`);
		this.permissions.on(['login', 'read']);
	},

	get: function () {
		return Promise.resolve({});
	},

	static: {
		test: function (source) {
			// TODO: Add more reliable test (https://github.com/solid/mavo-solid/issues/1)
			return /^https:\/\/[^/]+\.databox\.me/.test(source);
		},
	},
}));
})(Bliss);
