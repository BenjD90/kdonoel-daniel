import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { DynamicObject } from '../utils/types.utils';

@Directive({
	selector: '[n9EqualsTo][ngModel],[n9EqualsTo][formControl],[n9EqualsTo][formControlName]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => EqualsToValidatorDirective),
			multi: true,
		},
	],
})
export class EqualsToValidatorDirective implements Validator {
	static n9EqualsTo(
		controlName: string,
		reverse?: boolean,
		validationKey?: string,
	): EqualsToValidatorDirective {
		reverse = reverse || false;
		return new EqualsToValidatorDirective(controlName, '' + reverse, validationKey || '');
	}

	constructor(
		@Input('n9EqualsTo') public n9EqualsTo: string,
		@Input('reverse') public reverse: string,
		@Input('validationKey') public validationKey?: string,
	) {}

	private get isReverse() {
		if (!this.reverse) return false;
		return this.reverse === 'true';
	}

	validate(c: AbstractControl): DynamicObject {
		// console.log('validate');
		const value = c.value;
		const otherControl = c.root.get(this.n9EqualsTo);

		if (otherControl && value !== otherControl.value && !this.isReverse) {
			return { [this.validationKey || 'n9EqualsTo']: true };
		}

		if (otherControl && value === otherControl.value && this.isReverse) {
			delete otherControl.errors[this.validationKey || 'n9EqualsTo'];
			if (!Object.keys(otherControl.errors).length) {
				otherControl.setErrors(null);
			}
		}

		if (otherControl && value !== otherControl.value && this.isReverse) {
			otherControl.setErrors({ [this.validationKey || 'n9EqualsTo']: true });
		}
		return null;
	}
}
