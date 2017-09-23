import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import * as moment from 'moment';
import { DynamicObject } from '../utils/types.utils';
import Moment = moment.Moment;

@Directive({
	selector: '[al-earlierThan][ngModel],[al-earlierThan][formControl],[al-earlierThan][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => EarlierThanValidatorDirective), multi: true}
	]
})
export class EarlierThanValidatorDirective implements Validator {

	static earlierThan(controlName: string): EarlierThanValidatorDirective {
		return new EarlierThanValidatorDirective(controlName);
	}

	constructor(
		@Input('earlierThan') public earlierThan: string) {
	}

	validate(c: AbstractControl): DynamicObject {
		if (!c.value) return null;

		const mObjMax = moment(c.root.get(this.earlierThan).value);

		const mObj = moment(c.value);

		if (!mObj.isValid() || !mObjMax.isValid()) return null;

		return (mObjMax.isSameOrAfter(mObj)) ? null : {earlierThan: true};
	}
}
