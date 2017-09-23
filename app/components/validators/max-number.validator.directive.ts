import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { DynamicObject } from '../utils/types.utils';

@Directive({
	selector: '[al-max-number][ngModel],[al-max-number][formControl],[al-max-number][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxNumberValidatorDirective), multi: true}
	]
})
export class MaxNumberValidatorDirective implements Validator {

	private numMax: number;

	constructor(@Input('maxNumber') maxNumber) {
		this.numMax = Number.parseFloat(maxNumber);
	}

	validate(c: AbstractControl): DynamicObject {
		if (!c.value) return null;
		const num = Number.parseFloat(c.value);

		return this.numMax >= num ? null : {alMaxNumber: {max: this.numMax}};
	}
}
