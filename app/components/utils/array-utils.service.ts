import { Injectable } from '@angular/core';
import { Logger, LogService } from '../log/log.service';
import { DynamicObject } from './types.utils';

import _isArray = require('lodash/isArray');
import _pick = require('lodash/pick');
import _isEmpty = require('lodash/isEmpty');
import _isObject = require('lodash/isObject');

@Injectable()
export class ArrayUtilsService {

	/**
	 * Get a selector child of the one in parameter
	 *
	 * 'a.b.c' ==> 'b.c'
	 * 'b.c' ==> 'c'
	 * 'c' ==> ''
	 *
	 * @param selector
	 * @returns {string}
	 */
	private static getSubSelector(selector: string) {
		return selector.indexOf('.') + 1 > 0 ? selector.substr(selector.indexOf('.') + 1) : '';
	}

	private logger: Logger;

	constructor(private logService: LogService) {
		this.logger = logService.create('[PickAllInArray]');
	}

	/**
	 * Get all values matchs the selector in the array
	 *
	 * Example :
	 * pick([{a:'a',b: [{c:'c', d:'d'},{c:'c1'}]], 'b.c') ===>  ['c','c1']
	 *
	 * @param value an array to search in
	 * @param selector a string like 'a.b.c' for instance
	 * @returns An array containing all matchs
	 *
	 *
	 */
	public pick(value: any, selector: string): DynamicObject[] | string[] {
		if (!selector.match(/^\w+(\.\w+)*$/) && selector !== '') {
			this.logger.error('Wrong selector : "' + selector + '"');
			return;
		}
		if (!_isEmpty(value)) {
			const pickedValue = _pick(value, selector)[selector];
			if (_isArray(value)) {
				let retArray = [];
				value.forEach((element) => {
					if (!_isEmpty(element[selector.split('.')[0]])) {
						retArray = retArray.concat(this.pick(element[selector.split('.')[0]], ArrayUtilsService.getSubSelector(selector)));
					} else {
						retArray = retArray.concat(this.pick(element, selector.substr(selector.indexOf('.') + 1)));
					}
				});
				return [].concat(retArray);
			} else if (_isObject(value) && !_isEmpty(pickedValue)) {
				return [].concat(this.pick(pickedValue, ArrayUtilsService.getSubSelector(selector)));
			} else if (_isEmpty(pickedValue) && selector.length === 0) {
				return [value];
			} else {
				return [];
			}
		}
		return [];
	}
}
