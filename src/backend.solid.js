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

	get: function (url) {
		const resource = this.super.get.call(this, url);
		resource.then(() => {
			// TODO: Read actual permissions (https://github.com/solid/mavo-solid/issues/3)
			this.permissions.on(['edit', 'save']);
		});
		return resource;
	},

	put: function (serialized, url = this.url) {
		return fetch(url, {
			method: 'PUT',
			body: serialized,
			headers: {
				// TODO: Set actual content type (https://github.com/solid/mavo-solid/issues/2)
				'Content-Type': 'application/octet-stream',
			},
		});
	},

	static: {
		test: function (source) {
			// TODO: Add more reliable test (https://github.com/solid/mavo-solid/issues/1)
			return /^https:\/\/[^/]+\.(?:databox\.me|solidtest\.space)/.test(source);
		},
	},
}));
})(Bliss);
