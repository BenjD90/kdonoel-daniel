import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS } from '@angular/forms';
import * as moment from 'moment';
import { DynamicObject } from '../utils/types.utils';

@Directive({
	selector: '[n9DateFormat][ngModel],[n9DateFormat][formControl],[n9DateFormat][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => DateFormatValidatorDirective), multi: true}
	]
})
export class DateFormatValidatorDirective {
	constructor(
		@Input('n9DateFormat') public n9DateFormat) {
	}

	validate(c: AbstractControl): DynamicObject {
		return !c.value || moment(c.value, this.n9DateFormat).isValid()
			? null
			: {n9DateFormat: {invalid: true, format: this.n9DateFormat}};
	}
}
