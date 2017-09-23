module.exports = {
	webpackDevServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:6686',
				pathRewrite: {'^/api': ''}
			}
		},
		port: 8080
	}
};
