import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import * as moment from 'moment';
import { DynamicObject } from '../utils/types.utils';
import Moment = moment.Moment;

@Directive({
	selector: '[al-minDate][ngModel],[al-minDate][formControl],[al-minDate][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => MinDateValidatorDirective), multi: true}
	]
})
export class MinDateValidatorDirective implements Validator {

	private mObjMin: Moment;

	constructor(
		@Input('minDate') minDate: Date) {
		this.mObjMin = moment(minDate);
	}

	validate(c: AbstractControl): DynamicObject {
		if (!c.value) return null;
		const mObj = moment(c.value);
		if (!mObj.isValid() || !this.mObjMin.isValid()) return null;

		return (this.mObjMin.isBefore(mObj)) ? null : {minDate: true};
	}
}
