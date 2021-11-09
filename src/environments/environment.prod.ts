import * as _ from 'lodash';
import base from './base';
import { PublicConf } from './public-conf.models';

export const environment = _.merge({}, base.public, {
	name: 'prod',
} as PublicConf);
