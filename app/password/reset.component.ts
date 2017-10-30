import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ResetPasswordRequest, SessionService } from '../components/session/session.service';

import { SwalService } from '../components/utils/swal.service';
import { EqualsToValidatorDirective } from '../components/validators/equals-to.validator.directive';
import { PwdValidatorDirective } from '../components/validators/pwd.validator.directive';
import { PasswordService } from './password.service';

@Component({
	selector: 'al-reset',
	templateUrl: 'reset.component.html'
})
export class ResetComponent implements OnInit {

	resetForm: FormGroup;
	token: string;
	signup: boolean;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private password: PasswordService,
		private session: SessionService,
		private swal: SwalService) {
		this.resetForm = fb.group({
			pwd: ['', [Validators.required, PwdValidatorDirective.validPwd, EqualsToValidatorDirective.equalsTo('confirmedPwd', true)]],
			confirmedPwd: ['', [Validators.required, EqualsToValidatorDirective.equalsTo('pwd', false)]]
		});
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe((queryParams) => {
			this.token = queryParams['token'];
		});
		this.route.url.subscribe((url) => {
			this.signup = (url[0].path === 'signup');
			this.session.logout().subscribe();
		});
	}

	onSubmit() {
		if (!this.resetForm.valid) return;

		const req: ResetPasswordRequest = {
				token: this.token,
			newPassword: this.resetForm.value.pwd as string
		};

		this.session.resetPassword(req)
			.subscribe(
				(res) => {
					this.swal.translateSuccess('login.form.resetPassword.success.title', 'login.form.resetPassword.success.description');
					if (res.session) {
						this.session.openSession(res.session);
						(this.session.login$ as Subject<any>).next();
						return this.router.navigate(['']);
					}
				},
				(errorCode) => {
					// if password updated but login failed
					if (['doctors-not-found', 'several-doctors'].includes(errorCode)) {
						this.swal.translateSuccess('login.form.resetPassword.success.title', 'login.form.resetPassword.success.description', {}, {}, 2000);
						this.router.navigate(['/login']);
					} else this.swal.translateError('commons.error', `login.form.resetPassword.errors.${errorCode}`);
				});
	}
}
