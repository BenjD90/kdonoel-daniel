import { Component, forwardRef, HostBinding, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { PopoverDirective } from 'ngx-bootstrap';
import { FocusableComponent } from '../../directives/focusable.component';
import { noopWithValue } from '../../utils/misc.util';
import { CustomValidators } from '../../validators/custom-validators.utils';

@Component({
	selector: 'al-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DatePickerComponent),
			multi: true
		},
		{provide: FocusableComponent, useExisting: forwardRef(() => DatePickerComponent)}
	]
})
export class DatePickerComponent extends FocusableComponent implements ControlValueAccessor {
	@Input('datepickerMode') datepickerMode: string = 'day';
	@Input('datesDisabledArray') datesDisabledArray: { date: Date, mode: string }[];
	@Input('maxDate') maxDate: Date = null;
	@Input('minDate') minDate: Date = null;
	@Input('placeholder') placeholder: string = '';
	@Input('buttonClass') buttonClass: string = '';
	@Input('id') id: string = '';
	@Input('name') name: string = '';
	@Input('placement') placement: string = 'right';
	form: FormGroup;

	@ViewChild('pop', {read: PopoverDirective}) popover: PopoverDirective;

	@HostBinding('class.doesnt-show-invalidity') setClass: boolean = true;

	propagateChange = noopWithValue;
	private _value: Date;
	private _datepickerDisabled = false;

	get datepickerDisabled(): boolean {
		return this._datepickerDisabled;
	}

	@Input('datepickerDisabled')
	set datepickerDisabled(value: boolean) {
		if (value) {
			this.form.controls['textValue'].disable();
		} else {
			this.form.controls['textValue'].enable();
		}
		this._datepickerDisabled = value;
	}

	get value(): Date {
		return this._value;
	}

	set value(value: Date) {
		// console.log('set value', value);
		if (value !== null) {
			this._value = moment(value).utc().add(moment(value).utcOffset(), 'm').toDate();
		} else {
			this._value = value;
		}
		this.propagateChange(this._value);
	}

	constructor(
		private fb: FormBuilder) {
		super();
		this.form = this.fb.group({
			textValue: ['', [CustomValidators.dateFormat('DD/MM/YYYY')]],
			dateValue: [null, []]
		});

		this.form.controls['textValue'].valueChanges
			.subscribe((v) => this.textChange(v));
		this.form.controls['dateValue'].valueChanges
			.subscribe((v) => this.dateChange(v));
	}

	writeValue(newValue: any): void {
		// console.log(this.value, newValue, new Date(newValue));
		if (!newValue) {
			this.value = null;
			// we have to set value to undefined because ng2bootstrap's datepicker doesnt handle null
			this.form.controls['dateValue'].setValue(undefined);
			this.form.controls['textValue'].setValue(null);
			return;
		}
		newValue = new Date(newValue);
		this.value = newValue;
		this.form.controls['dateValue'].setValue(newValue);
		this.form.controls['textValue'].setValue(this.dateToText(newValue));
		// console.log(this.form.value);
	}

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {
	}

	closePopover() {
		/*
		 * There is a bug in ng2-bootstrapp datepicker: when onSelectionDone is emitted, model value is not updated yet
		 * workaround: use setTimeout to consume model value
		 * https://github.com/valor-software/ng2-bootstrap/issues/1555
		 */
		setTimeout(
			() => {
				// console.log('closePopover', this.form.controls["dateValue"].value);
				this.popover.hide();
				this.form.controls['textValue'].setValue(this.dateToText(this.form.controls['dateValue'].value));
				this.value = this.form.controls['dateValue'].value;
			}
		);
	}

	textChange(newValue) {
		// console.log(newValue);
		const newCalValue = this.textToDate(newValue);
		if (newCalValue) {
			this.form.controls['dateValue'].setValue(newCalValue);
			this.value = newCalValue;
		} else {
			this.form.controls['dateValue'].setValue(undefined);
			this.value = null;
		}
	}

	dateChange(newValue) {
		// console.log('dateChange', newValue);
	}

	dateToText(dateValue: Date): string {
		// console.log(dateValue, moment(dateValue).format("DD/MM/YYYY"));
		return moment(dateValue).format('DD/MM/YYYY');
	}

	textToDate(textValue): Date {
		const m = moment(textValue, 'DD/MM/YYYY', true);
		if (!m.isValid()) return null;
		return m.toDate();
	}

	onTextInputFocus() {
		// console.log('focus', this.popover);
		this.focusChange.emit('focus');
		if (!!this.popover) this.popover.hide();
	}

	onTextInputBlur() {
		// console.log('blur');
		this.focusChange.emit('blur');
	}
}
