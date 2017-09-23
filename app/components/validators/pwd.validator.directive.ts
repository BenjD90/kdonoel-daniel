import { Directive, forwardRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
	selector: '[n9-email][ngModel],[n9-email][formControl]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => PwdValidatorDirective), multi: true}
	]
})
export class PwdValidatorDirective implements Validator {

	static validPwd(c: FormControl) {

		/**
		 * At least one of the following regex must be complete
		 */

			// at least 1 digit && 1 uppercase && 1 lowercase
		const dulRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d{}()\[\]#,:;^.?!|&_`~@$%\/\\=+\-*"']{8,}$/;
		// au moins 1 digit && 1 uppercase && 1 special char
		const dusRegexp = /^(?=.*[A-Z])(?=.*[{}()\[\]#,:;^.?!|&_`~@$%\/\\=+\-*"'])(?=.*\d)[A-Za-z\d{}()\[\]#,:;^.?!|&_`~@$%\/\\=+\-*"']{8,}$/;
		// au moins 1 digit && 1 lowercase && 1 special char
		const dlsRegexp = /^(?=.*[a-z])(?=.*[{}()\[\]#,:;^.?!|&_`~@$%\/\\=+\-*"'])(?=.*\d)[A-Za-z\d{}()\[\]#,:;^.?!|&_`~@$%\/\\=+\-*"']{8,}$/;
		// au moins 1 uppercase && 1 lowercase && 1 special char
		const ulsRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[{}()\[\]#,:;^.?!|&_`~@$%\/\\=+\-*"'])[A-Za-z\d{}()\[\]#,:;^.?!|&_`~@$%\/\\=+\-*"']{8,}$/;

		return (dulRegexp.test(c.value) || dusRegexp.test(c.value) || dlsRegexp.test(c.value) || ulsRegexp.test(c.value)) ? null : {pwdValid: true};
	}

	validate(c: FormControl) {
		return PwdValidatorDirective.validPwd(c);
	}
}
