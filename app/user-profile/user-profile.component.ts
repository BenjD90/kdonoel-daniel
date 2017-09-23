import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../components/models/users/users.models';
import { ResetPasswordRequest, SessionService } from '../components/session/session.service';

import { SwalService } from '../components/utils/swal.service';
import { EqualsToValidatorDirective } from '../components/validators/equals-to.validator.directive';
import { PwdValidatorDirective } from '../components/validators/pwd.validator.directive';
import { PasswordService } from '../password/password.service';
import { UsersService } from '../users/users.service';

import _isEmpty = require('lodash/isEmpty');

@Component({
	selector: 'al-profile',
	templateUrl: 'user-profile.component.html'
})

export class UserProfileComponent implements OnInit {

	resetForm: FormGroup;
	user: User;
	loading: boolean = false;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private passwordService: PasswordService,
		private sessionService: SessionService,
		private swal: SwalService,
		private userServices: UsersService) {
		this.resetForm = fb.group({
			oldPwd: ['', [Validators.required, PwdValidatorDirective.validPwd]],
			pwd: ['', [Validators.required, PwdValidatorDirective.validPwd, EqualsToValidatorDirective.equalsTo('confirmedPwd', true)]],
			confirmedPwd: ['', [Validators.required, EqualsToValidatorDirective.equalsTo('pwd', false)]]
		});
	}

	ngOnInit(): void {
		this.loading = true;
		const userId = this.sessionService.getSession().profile.userId;
		this.userServices.getUser(userId).subscribe((user) => {
			this.user = user.user;
			this.loading = false;
		});
	}

	onSubmit() {
		if (!this.resetForm.valid) return;

		const reqNew = {
			email: this.user.email,
			signup: false
		};

		this.passwordService.requestNewPwd(reqNew).subscribe((userToken) => {
				const reqReset: ResetPasswordRequest = {
					signup: false,
					user: {
						token: userToken.userAndToken.token,
						password: this.resetForm.value.pwd
					},
					oldPassword: this.resetForm.value.oldPwd
				};
				this.sessionService.resetPassword(reqReset).subscribe((res) => {
						this.swal.translateSuccess('login.form.resetPassword.success.title', 'login.form.resetPassword.success.description');
						setTimeout(() => {
							if (res.validCredentialsToken) {
								// TODO this.reloadSession();
							}
						}, 1000);
					},
					(errorCode) => {
						// if passwordService updated but login failed
						if (['account-locked', 'doctors-not-found', 'several-doctors'].includes(errorCode)) {
							this.swal.translateSuccess('login.form.resetPassword.success.title', 'login.form.resetPassword.success.description', {}, {}, 2000);
							this.router.navigate(['/login']);
						} else this.swal.translateError('commons.error', `login.form.resetPassword.errors.${errorCode}`);
					});
			},
			(errorCode) => SwalService.error('Une erreur s\'est produite!', errorCode)
		);
	}
}
