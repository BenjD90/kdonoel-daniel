import { DateFormatValidatorDirective } from './date-format.validator.directive';
import { DigitsValidatorDirective } from './digits.validator.directive';
import { EarlierThanValidatorDirective } from './earlier-than.validator.directive';
import { EmailValidatorDirective } from './email.validator.directive';
import { EqualsToValidatorDirective } from './equals-to.validator.directive';
import { GreatherThanValidatorDirective } from './geather-than.validator.directive';
import { LengthValueValidatorDirective } from './length-value.validator.directive';
import { MaxDateValidatorDirective } from './max-date.validator.directive';
import { MaxNumberValidatorDirective } from './max-number.validator.directive';
import { MinDateValidatorDirective } from './min-date.validator.directive';
import { MinNumberValidatorDirective } from './min-number.validator.directive';

export abstract class CustomValidators {

	public static DEFAULT_DATE_PATTERN = 'DD/MM/YYYY';

	public static email = EmailValidatorDirective.validEmail;

	static equalsTo(controlName: string, reverse?: boolean, validationKey?: string): EqualsToValidatorDirective {
		reverse = reverse || false;
		return new EqualsToValidatorDirective(controlName, '' + reverse, validationKey || '');
	}

	static dateFormat(format?: string): DateFormatValidatorDirective {
		return new DateFormatValidatorDirective(format || CustomValidators.DEFAULT_DATE_PATTERN);
	}

	static digitsNumber(value: any): DigitsValidatorDirective {
		return new DigitsValidatorDirective(value);
	}

	static maxNumber(value: any): MaxNumberValidatorDirective {
		return new MaxNumberValidatorDirective(value);
	}

	static minNumber(value: any): MinNumberValidatorDirective {
		return new MinNumberValidatorDirective(value);
	}

	static maxLength(value: any): LengthValueValidatorDirective {
		return new LengthValueValidatorDirective(value);
	}

	static minDate(value: any): MinDateValidatorDirective {
		return new MinDateValidatorDirective(value);
	}

	static maxDate(value: any): MaxDateValidatorDirective {
		return new MaxDateValidatorDirective(value);
	}

	static greatherThan(controlName): GreatherThanValidatorDirective {
		return new GreatherThanValidatorDirective(controlName);
	}

	static earlierThan(controlName): EarlierThanValidatorDirective {
		return new EarlierThanValidatorDirective(controlName);
	}
}
