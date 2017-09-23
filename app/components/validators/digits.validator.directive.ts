import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { DynamicObject } from '../utils/types.utils';

@Directive({
	selector: '[al-digits][ngModel],[al-digits][formControl],[al-digits][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => DigitsValidatorDirective), multi: true}
	]
})
export class DigitsValidatorDirective {
	private digitsRegex: RegExp;

	constructor(
		@Input('digitsNumber') public digitsNumber) {
	}

	validate(c: AbstractControl): DynamicObject {
		if (!c.value) return null;

		if (this.digitsNumber > 0) this.digitsRegex = new RegExp('^\\d+(?:[\.\,]\\d{1,' + this.digitsNumber + '})?$', 'i');
		else this.digitsRegex = /^[0-9]+$/i;

		return this.digitsRegex.test(c.value) ? null : {alDigits: {digitsNumber: this.digitsNumber}};
	}
}
