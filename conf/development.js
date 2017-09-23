module.exports = {
	webpackDevServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:6690',
				pathRewrite: {'^/api': ''}
			}
		},
		port: 8080
	}
};
