import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import swal, { SweetAlertInputOptions } from 'sweetalert2';

import _assignIn = require('lodash/assignIn');
/**
 *
 * For swal.noop visit : https://github.com/limonte/sweetalert2#handling-dismissals
 *
 */
@Injectable()
export class SwalService {

	static empty: string = 'empty.empty';

	static success(title: string, description: string = '', timer: number = 1000) {
		swal({
			title,
			text: description,
			type: 'success',
			timer,
			showConfirmButton: false
		}).catch(swal.noop);
	}

	static error(title: string, description: string = '') {
		swal(title, description, 'error').catch(swal.noop);
	}

	static info(title: string, description: string = '', allowOutsideClick: boolean = true, allowEscapeKey: boolean = true) {
		swal({
			title,
			text: description,
			showConfirmButton: true,
			showCancelButton: false,
			allowOutsideClick,
			allowEscapeKey
		}).catch(swal.noop);
	}

	static confirm(title: string, description: string = '', options: object = {}) {
		return swal(_assignIn({
			title,
			text: description,
			type: 'warning',
			showCancelButton: true,
			cancelButtonText: 'NO',
			confirmButtonText: 'SI'
		}, options));
	}

	static input(title: string, description: string = '', options: object = {}) {
		return swal(_assignIn({
			title,
			text: description,
			input: 'text',
			showCancelButton: true,
			cancelButtonText: 'Annular',
			confirmButtonText: 'Validar'
		}, options));
	}

	constructor(private translateService: TranslateService) {
	}

	translateSuccess(title: string, description: string = SwalService.empty, titleParams?: object, descriptionParams?: object, timer: number = 1000) {
		Observable.forkJoin(
				this.translateService.get(title, titleParams),
				this.translateService.get(description, descriptionParams)
		).subscribe(([titleTranslated, descriptionTranslated]) => {
			SwalService.success(titleTranslated, descriptionTranslated, timer);
		});
	}

	translateError(title: string, description: string = SwalService.empty) {
		Observable.zip(
				this.translateService.get(title),
				this.translateService.get(description)
		).subscribe(([titleTranslated, descriptionTranslated]) => {
			SwalService.error(titleTranslated, descriptionTranslated);
		});
	}

	translateInfo(title: string, description: string = SwalService.empty, allowOutsideClick: boolean = true, allowEscapeKey: boolean = true) {
		Observable.forkJoin(
				this.translateService.get(title),
				this.translateService.get(description)
		).subscribe(([titleTranslated, descriptionTranslated]) => {
			SwalService.info(titleTranslated, descriptionTranslated, allowOutsideClick, allowEscapeKey);
		});
	}

	translateConfirm(title: string, description: string = SwalService.empty, options: object = {}): Observable<any> {
		return Observable.forkJoin(
				this.translateService.get(title),
				this.translateService.get(description)
		).flatMap(([titleTranslated, descriptionTranslated]) => {
			return Observable.fromPromise(SwalService.confirm(titleTranslated, descriptionTranslated, options));
		});
	}

	translateInput(title: string, description: string = SwalService.empty, options: object = {}) {
		Observable.forkJoin(
				this.translateService.get(title),
				this.translateService.get(description)
		).subscribe(([titleTranslated, descriptionTranslated]) => {
			SwalService.input(titleTranslated, descriptionTranslated, options);
		});
	}

	checkbox(title: string, description: string = '', checkBoxText: string = '', allowOutsideClick: boolean = true, allowEscapeKey: boolean = true) {
		swal({
			title,
			text: description,
			input: 'checkbox',
			showConfirmButton: true,
			showCancelButton: false,
			allowOutsideClick,
			allowEscapeKey,
			inputPlaceholder: checkBoxText,
			inputValidator: (result) => {
				return new Promise<void>((resolve, reject) => {
					if (result) {
						resolve();
					} else {
						this.translateService.get('errors.required').subscribe((errorMsg) => {
							reject(errorMsg);
						});
					}
				});
			}
		}).catch(swal.noop);
	}

	translateCheckbox(title: string, description: string = SwalService.empty, checkBoxText: string = SwalService.empty, allowOutsideClick: boolean = true, allowEscapeKey: boolean = true) {
		Observable.forkJoin(
				this.translateService.get(title),
				this.translateService.get(description),
				this.translateService.get(checkBoxText)
		).subscribe(([titleTranslated, descriptionTranslated, checkBoxTextTranslated]) => {
			this.checkbox(titleTranslated, descriptionTranslated, checkBoxTextTranslated, allowOutsideClick, allowEscapeKey);
		});
	}

	select(title: string, description: string = '', selectOptions: SweetAlertInputOptions, allowOutsideClick: boolean = true, allowEscapeKey: boolean = true): Observable<any> {
		return Observable.fromPromise(swal({
			title,
			input: 'select',
			inputOptions: selectOptions,
			inputPlaceholder: description,
			showConfirmButton: true,
			showCancelButton: false,
			allowOutsideClick,
			allowEscapeKey,
			inputValidator: (result) => {
				return new Promise<void>((resolve, reject) => {
					if (result) {
						resolve();
					} else {
						this.translateService.get('commons.errors.required').subscribe((errorMsg) => {
							reject(errorMsg);
						});
					}
				});
			}
		}).catch(swal.noop));
	}

	public translateSelect(
			title: string,
			description: string = SwalService.empty,
			selectOptions: SweetAlertInputOptions = {},
			allowOutsideClick: boolean = true,
			allowEscapeKey: boolean = true): Observable<any> {
		let titleTranslated;
		let descriptionTranslated;
		this.translateService.get(title).subscribe((res) => {
			titleTranslated = res;
		});
		this.translateService.get(description).subscribe((res) => {
			descriptionTranslated = res;
		});
		return this.select(titleTranslated, descriptionTranslated, selectOptions, allowOutsideClick, allowEscapeKey);
	}
}
