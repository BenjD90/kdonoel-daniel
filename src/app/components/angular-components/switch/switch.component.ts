import { Component, EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noopWithValue } from '../../utils/misc.util';

// tslint:disable:no-use-before-declare
const AL_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => AlSwitchComponent),
	multi: true,
};
// tslint:enable

@Component({
	selector: 'al-switch',
	templateUrl: './switch.component.html',
	styleUrls: ['./switch.component.scss'],
	providers: [AL_SWITCH_CONTROL_VALUE_ACCESSOR],
})
export class AlSwitchComponent implements ControlValueAccessor {
	defaultBgColor: string = '#fff';
	defaultBoColor: string = '#dfdfdf';

	@Input() size: string = 'medium';
	@Output() change = new EventEmitter<boolean>();
	@Input() color: string = '#1AA2D6';
	@Input() switchOffColor: string = '';
	@Input() switchColor: string = '#fff';

	private onTouchedCallback = noopWithValue;
	private onChangeCallback = noopWithValue;

	private _checked: boolean;
	private _disabled: boolean;
	private _reverse: boolean;

	@Input() set checked(v: boolean) {
		this._checked = v !== false;
	}

	get checked() {
		return this._checked;
	}

	@Input()
	set disabled(v: boolean) {
		this._disabled = v !== false;
	}

	get disabled() {
		return this._disabled;
	}

	@Input()
	set reverse(v: boolean) {
		this._reverse = v !== false;
	}

	get reverse() {
		return this._reverse;
	}

	getColor(flag?: string) {
		if (flag === 'borderColor') return this.defaultBoColor;
		if (flag === 'switchColor') {
			if (this.reverse)
				return !this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
			return this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
		}
		if (this.reverse) return !this.checked ? this.color : this.defaultBgColor;
		return this.checked ? this.color : this.defaultBgColor;
	}

	@HostListener('click')
	onToggle() {
		if (this.disabled) return;
		this.checked = !this.checked;
		this.change.emit(this.checked);
		this.onChangeCallback(this.checked);
		this.onTouchedCallback(this.checked);
	}

	writeValue(obj: any): void {
		if (obj !== this.checked) {
			this.checked = !!obj;
		}
	}

	registerOnChange(fn: any) {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouchedCallback = fn;
	}
}
