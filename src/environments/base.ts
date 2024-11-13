import pkg from '../../package.json';
import { PublicConf } from './public-conf.models';

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
