import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { DynamicObject } from '../utils/types.utils';

@Directive({
	selector: '[al-length-value][ngModel],[al-length-value][formControl],[al-length-value][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => LengthValueValidatorDirective), multi: true}
	]
})
export class LengthValueValidatorDirective implements Validator {

	private lengthMax: number;

	constructor(@Input('lengthValue') lengthValue) {
		this.lengthMax = Number.parseFloat(lengthValue);
	}

	validate(c: AbstractControl): DynamicObject {
		if (!c.value) return null;
		const length = c.value.toString().length;

		return this.lengthMax >= length ? null : {alMaxLength: {length: this.lengthMax}};
	}
}
