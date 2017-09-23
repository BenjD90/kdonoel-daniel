import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import * as moment from 'moment';
import { DynamicObject } from '../utils/types.utils';
import Moment = moment.Moment;

@Directive({
	selector: '[al-greatherThan][ngModel],[al-greatherThan][formControl],[al-greatherThan][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => GreatherThanValidatorDirective), multi: true}
	]
})
export class GreatherThanValidatorDirective implements Validator {

	static greatherThan(controlName: string): GreatherThanValidatorDirective {
		return new GreatherThanValidatorDirective(controlName);
	}

	constructor(
		@Input('greatherThan') public greatherThan: string) {
	}

	validate(c: AbstractControl): DynamicObject {
		if (!c.value) return null;

		const mObjMin = moment(c.root.get(this.greatherThan).value);

		const mObj = moment(c.value);

		if (!mObj.isValid() || !mObjMin.isValid()) return null;

		return (mObjMin.isSameOrBefore(mObj)) ? null : {greatherThan: true};
	}
}
