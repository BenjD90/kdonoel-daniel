# Liste de kdos de Noel

# Installation
* clone / fork the repo
* `npm i`

# Commands
* `npm start` builds the application
* `npm run watch` builds the application, and starts watch mode
* `npm run watch:hmr` builds the application, and starts watch mode with Hot Module Reload / Livereload. The page is available at `http://localhost:8080` by default.
* `npm run tslint` runs tslint
* `npm test` run ALL unit tests once, in PhantomJS
* `npm run test:once` alias for `npm test`
* `npm tdd` run ALL unit tests once, and starts watch mode

# Things to know
* Please do not include lodash directly (ie: `import _ from 'lodash';`), as it will include all the lodash library which is huge (500+ Mb). Instead, import only the operators you need (ex: `import _map = require("lodash/map");` ).
* Place your conf properties in the `conf` folder. There is one file per environment (ie: `conf/development.js`, `conf/production.js`, etc). All the variables in the `env` property will be injected in the Angular application at runtime, and will be available via `ConfigurationService`, or via the global `process.env` variable.
* If you use `watch:hmr`, you can configure it via the `conf` folder. Anything you place in the `webpackDevServer` property will override the webpack-dev-server conf.
* If you want to make a directive/pipe/component available in the whole project, please add it to `app/components/shared/shared-module.ts`, and make sure you import this module in all sub modules.
* If you want to make a service/provider available in the whole project, please add it to the `app/components/core/core-module`. Make sure that this module is **only** imported in the root module; otherwise your services would be instantiated multiple times which could cause weird issues.