import { Backend } from 'Mavo';
import * as solid from 'solid-auth-client';
import loadProfile from './profile.js';

export default class SolidBackend extends Backend {
	id = 'a Solid space';

	constructor(url, options) {
		super(url, options);

		// Construct the application's data URL
		const extension = this.format.constructor.extensions[0] || '.json';
		this.url = this.source.replace(/\/?$/, `/${this.mavo.id}${extension}`);

		// Allow logging in and reading by default
		this.permissions.on(['login', 'read']);
		// Check if the user happens to be logged in
		this.login(true);
	}

	login(passive) {
		const auth = passive ? solid.currentSession() : solid.login(this.url);
		return auth.then(({ session })  => {
			if (!session)
				return this.logout();
			this.user = { url: session.webId };
			this.loadProfile().then(() => {
				this.permissions.on(['logout']);
			});
		});
	}

	logout() {
		return solid.logout().then(() => {
			this.user = null;
			this.permissions.on('login');
		});
	}

	get(url = new URL(this.url)) {
		const request = solid.fetch(url);
		request.then(() => {
			// TODO: Read actual permissions (https://github.com/solid/mavo-solid/issues/3)
			this.permissions.on(['edit', 'save']);
		});
		return this.authorize(request).then(response => response.text());
	}

	put(serialized, url = this.url) {
		const request = solid.fetch(url, {
			method: 'PUT',
			body: serialized,
			headers: {
				// TODO: Set actual content type (https://github.com/solid/mavo-solid/issues/2)
				'Content-Type': 'application/octet-stream',
			},
		});
		return this.authorize(request);
	}

	authorize(request) {
		return request.then(response => {
			if (response.status === 401 || response.status === 403)
				throw new Error('Not authorized to perform this action.');
			return response;
		});
	}

	// Augments `this.user` with profile data (name, avatar)
	loadProfile() {
		const url = this.user.url;
		return solid.fetch(url)
			.then(res => Promise.all([res.text(), res.headers.get('Content-Type')]))
			.then(([contents, contentType]) => loadProfile({ url, contents, contentType }))
			.then(profile => {
				Object.assign(this.user, profile);
				if (profile.accountName)
					this.id = profile.accountName;
				return profile;
			});
	}

	static test(source) {
		// TODO: Add more reliable test (https://github.com/solid/mavo-solid/issues/1)
		return /^https:\/\/[^/]+\.(?:databox\.me|solidtest\.space)/.test(source);
	}
}
