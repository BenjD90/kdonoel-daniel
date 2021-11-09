export interface PublicConf {
	production?: boolean;
	app?: {
		name: string;
		version: string;
	};
	api?: {
		baseHref?: string;
		serverHost: string;
		ignoredRoutes?: string[];
	};
	name?: string;
}
