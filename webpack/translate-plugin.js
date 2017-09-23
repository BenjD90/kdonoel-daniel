const dynamicI18n = require('dynamic-i18n');
const fs = require('fs');

function TranslatePlugin(options) {
	this.options = options
}

TranslatePlugin.prototype.apply = function (compiler) {
	compiler.plugin('emit', (compilation, callback) => {
				console.log('\nTranslate START');
				const configuration = this.options['dynamic-i18n'].conf;

				let outputPath = '';
				if (compilation.outputOptions.path !== '/') {
					outputPath = compilation.outputOptions.path + '/';
				}

				// uncomment to export at the first run
				// dynamicI18n.exportI18n([{
				// 	path: __dirname + '/../app/translations/fr-FR.json',
				// 	key: 'fr-FR'
				// }, {
				// 	path: __dirname + '/../app/translations/en-GB.json',
				// 	key: 'en-GB'
				// }], configuration, (err) => {
				// 	if (err) {
				// 		console.log(err);
				// 	}
				// });
				//

				if (!fs.existsSync(compilation.outputOptions.path)) {
					fs.mkdirSync(compilation.outputOptions.path);
				}


				dynamicI18n.importI18n(outputPath + 'translations', configuration, (err) => {
					if (err) {
						console.log(err);
						return;
					}

					console.log('Translate END');
					callback();
				});

			}
	)
	;
}
;

module.exports = TranslatePlugin;