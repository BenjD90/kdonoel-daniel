import { PublicConf } from './public-conf.models';

// tslint:disable-next-line:no-var-requires
const pkg = require('../../package.json');

export default {
	public: {
		production: false,
		app: {
			name: pkg.name,
			version: pkg.version,
		},
		api: {
			baseHref: '/api',
			serverHost: 'http://localhost:6686',
			ignoredRoutes: ['^/assets/.*$', '^http://.*', '^https://.*'],
		},
	} as PublicConf,
};
