import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import * as moment from 'moment';
import { DynamicObject } from '../utils/types.utils';
import Moment = moment.Moment;

@Directive({
	selector: '[al-maxDate][ngModel],[al-maxDate][formControl],[al-maxDate][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxDateValidatorDirective), multi: true}
	]
})
export class MaxDateValidatorDirective implements Validator {

	private mObjMax: Moment;

	constructor(
		@Input('maxDate') maxDate: Date) {
		this.mObjMax = moment(maxDate);
	}

	validate(c: AbstractControl): DynamicObject {
		if (!c.value) return null;
		const mObj = moment(c.value);
		if (!mObj.isValid() || !this.mObjMax.isValid()) return null;

		return (this.mObjMax.isAfter(mObj)) ? null : {maxDate: true};
	}
}
