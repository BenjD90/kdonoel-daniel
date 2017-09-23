import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { DynamicObject } from '../utils/types.utils';

@Directive({
	selector: '[al-min-number][ngModel],[al-min-number][formControl],[al-min-number][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => MinNumberValidatorDirective), multi: true}
	]
})
export class MinNumberValidatorDirective implements Validator {

	private numMin: number;
	private validationKey: string;

	constructor(@Input('minNumber') minNumber) {
		this.numMin = Number.parseFloat(minNumber);
	}

	validate(c: AbstractControl): DynamicObject {
		if (!c.value) return null;
		const num = Number.parseFloat(c.value);

		return this.numMin <= num ? null : {alMinNumber: {min: this.numMin}};
	}
}
