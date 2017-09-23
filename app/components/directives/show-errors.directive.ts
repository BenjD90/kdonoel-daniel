import { AfterContentInit, ContentChild, Directive, ElementRef, Input, Renderer } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { FocusableComponent } from './focusable.component';
import _map = require('lodash/map');
import _isObject = require('lodash/isObject');

declare type FormControlStatus = 'INVALID' | 'VALID';
declare type InputFocusStatus = 'untouched' | 'blur' | 'focus';

// todo: add doc
// todo: do not display validation for empty & optional inputs
@Directive({
	selector: '[n9ShowErrors]',
	exportAs: 'n9ShowErrors'
})
export class ShowErrorsDirective implements AfterContentInit {
	@Input('n9ShowErrorsDisabled') private n9ShowErrorsDisabled;
	@Input('disableValidationPicto') private disableValidationPicto;
	@Input('errorsTranslationPrefix') private errorsTranslationPrefix;
	@Input('displayOnlyOne') private displayOnlyOne;

	@ContentChild(NgControl) private control: NgControl;
	@ContentChild(FocusableComponent) private focusItem: FocusableComponent;
	@ContentChild(NgControl, {read: ElementRef}) private inputRef: ElementRef;
	@ContentChild('input', {read: ElementRef}) private input: ElementRef;

	private validPicto: any;
	private invalidPicto: any;
	private errorsPlaceholder: any;

	constructor(
		private el: ElementRef,
		private renderer: Renderer,
		private translateService: TranslateService) {
	}

	ngAfterContentInit() {
		if (this.n9ShowErrorsDisabled) return;

		const statusChanges$ = this.makeStatusChange();
		const focusChange$ = this.makeFocusChange();

		statusChanges$.combineLatest(focusChange$.startWith('untouched'))
			.subscribe(([status, inputState]) => this.onStatusChange(status, inputState as InputFocusStatus));
	}

	createPicto(clazz: string) {
		const picto = this.renderer.createElement(null, 'i');
		this.renderer.setElementClass(picto, 'fa', true);
		this.renderer.setElementClass(picto, clazz, true);
		this.renderer.setElementClass(picto, 'validation-picto', true);
		return picto;
	}

	hideValidationState() {
		if (this.validPicto && this.validPicto.parentNode) {
			this.validPicto.parentNode.removeChild(this.validPicto);
		}
		if (this.invalidPicto && this.invalidPicto.parentNode) {
			this.invalidPicto.parentNode.removeChild(this.invalidPicto);
		}
		this.el.nativeElement.classList.remove('has-error');
		this.el.nativeElement.classList.remove('is-ok');
	}

	displayValidState() {
		if (!this.disableValidationPicto) {
			if (!this.validPicto) {
				this.validPicto = this.createPicto('fa-check');
			}
			this.getInputNativeElement().parentNode.insertBefore(this.validPicto, this.getInputNativeElement().nextSibling);
		}
		this.el.nativeElement.classList.add('is-ok');
	}

	displayErrors() {
		if (!this.errorsPlaceholder) {
			this.errorsPlaceholder = this.renderer.createElement(null, 'div');
			this.renderer.setElementClass(this.errorsPlaceholder, 'n9-validation-errors', true);
		}
		this.errorsPlaceholder.innerHTML = '';

		const allErrors =
			_map(
				this.getControl().errors,
				// todo: use this.translateService.instant
				(value, key) => {
					return this.translateService.get((this.errorsTranslationPrefix || 'form.errors') + '.' + key, _isObject(value) ? value : {});
				}
			)
				.filter((t: any) => !!t && !!t.value)
				.map((t: any) => t.value);

		if (this.displayOnlyOne) this.errorsPlaceholder.innerHTML = allErrors[0];
		else this.errorsPlaceholder.innerHTML = allErrors.join('<br />');
		this.getInputNativeElement().parentNode.insertBefore(this.errorsPlaceholder, this.getInputNativeElement().nextSibling);
	}

	displayInvalidState() {
		if (!this.disableValidationPicto) {
			if (!this.invalidPicto) {
				this.invalidPicto = this.createPicto('fa-close');
			}
			this.getInputNativeElement().parentNode.insertBefore(this.invalidPicto, this.getInputNativeElement().nextSibling);
		}
		this.el.nativeElement.classList.add('has-error');
		this.displayErrors();
	}

	onStatusChange(status: FormControlStatus, inputState: InputFocusStatus) {
		// console.log('onStatusChange', status, inputState);

		if (inputState === 'untouched') {
			if (status === 'VALID') {
				this.hideValidationState();
				this.displayValidState();
			} else {
				this.hideValidationState();
			}
			return;
		}

		if (inputState === 'focus') {
			this.hideValidationState();
			return;
		}

		if (inputState === 'blur') {
			this.hideValidationState();
			if (status === 'VALID') {
				this.displayValidState();
			} else {
				this.displayInvalidState();
			}
		}
	}

	private makeFocusChange(): Observable<InputFocusStatus> {
		// console.log('makeFocusChange', this.focusItem, this.inputRef);
		if (!!this.focusItem) {
			return this.focusItem.focusChange;
		}
		return Observable
			.fromEvent(this.getInputNativeElement(), 'blur').map((e) => 'blur')
			.merge(Observable.fromEvent(this.getInputNativeElement(), 'focus').map((e) => 'focus'));
	}

	private makeStatusChange(): Observable<FormControlStatus> {
		// console.log('makeStatusChange', this.control);
		return this.control.statusChanges.startWith(this.control.control.status);
	}

	private getControl(): AbstractControl {
		return this.control.control;
	}

	private getInputNativeElement(): any {
		if (!!this.inputRef) return this.inputRef.nativeElement;
		return this.input.nativeElement;
	}
}
