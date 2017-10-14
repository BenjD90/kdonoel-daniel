import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Logger, LogService } from '../components/log/log.service';
import { Credentials, SessionService } from '../components/session/session.service';
import { SwalService } from '../components/utils/swal.service';
import { EmailValidatorDirective } from '../components/validators/email.validator.directive';
import { PwdValidatorDirective } from '../components/validators/pwd.validator.directive';
import _get = require('lodash/get');

@Component({
	selector: 'n9-login',
	templateUrl: 'login.component.html',
	// careful: we do not have sourcemaps when using styleUrls (yet)
	styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
	logger: Logger;
	errors: string[] = [];
	loading: boolean;

	loginForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private sessionService: SessionService,
		private logService: LogService,
		private swal: SwalService) {
		this.logger = this.logService.create('[LoginComponent]');
	}

	ngOnInit(): void {
		if (this.sessionService.getSession()) {
			this.router.navigate(['/']);
		}

		this.loginForm = this.fb.group({
			email: [
				'', [
					Validators.required,
					EmailValidatorDirective.validEmail
				]
			],
			password: [
				'', [
					Validators.required,
					PwdValidatorDirective.validPwd
				]
			]
		});
	}

	async submit($event) {
		$event.stopPropagation();
		if (!this.loginForm.valid) return;
		if (!this.loginForm.valid) return;

		this.loading = true;
		this.errors = [];
		this.sessionService.login(this.loginForm.getRawValue() as Credentials)
			.subscribe((res) => {
				if (res.profile) {
					this.sessionService.openSession(res);
					(this.sessionService.login$ as Subject<any>).next();
					return this.router.navigate(['']).then(() => this.loading = false);
				}
			}, (err) => {
				this.loading = false;

				const errorCode = err.code || 'unknown-error';

				if (errorCode === 'change-password-required') {
					this.loading = true;
					if (!_get(err, 'error.context.token')) {
						this.logger.error('token missing in response !', err);
					}
					this.router.navigate(['/password/reset'], {queryParams: {token: err.error.context.token}}).then(() => this.loading = false);
				}
				this.errors.push(
					['invalid-credentials', 'account-locked', 'doctors-not-found', 'several-doctors'].includes(errorCode)
						? 'login.form.errors.' + errorCode
						: 'commons.errors.unknown-error'
				);
			});

		return false;
	}

	reset() {
		this.router.navigate(['']);
	}
}
