(function ($, solid) {
const _ = Mavo.Backend.register($.Class({
	extends: Mavo.Backend,
	id: 'Solid',
	constructor: function () {
		// Construct the application's data URL
		const extension = this.format.constructor.extensions[0] || '.json';
		this.url = this.source.replace(/\/?$/, `/${this.mavo.id}${extension}`);

		// Allow logging in and reading by default
		this.permissions.on(['login', 'read']);
		// Check if the user happens to be logged in
		this.login(true);
	},

	login: function (passive) {
		const auth = passive ? solid.currentSession() : solid.login(this.url);
		return auth.then(({ session })  => {
			if (!session)
				return this.logout();
			this.user = {
				url: session.webId,
				username: session.webId,
				// TODO: add real name (https://github.com/solid/mavo-solid/issues/5)
				name: session.webId,
			};
			this.permissions.on(['logout']);
		});
	},

	logout: function () {
		return solid.logout().then(() => {
			this.user = null;
			this.permissions.on('login');
		});
	},

	get: function (url = new URL(this.url)) {
		const request = solid.fetch(url);
		request.then(() => {
			// TODO: Read actual permissions (https://github.com/solid/mavo-solid/issues/3)
			this.permissions.on(['edit', 'save']);
		});
		return request.then(response => response.text());
	},

	put: function (serialized, url = this.url) {
		return solid.fetch(url, {
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
})(Bliss, SolidAuthClient);
