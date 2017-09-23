import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../components/models/users/users.models';
import { ResetPasswordRequest, Session, SessionService } from '../components/session/session.service';
import { SelectItems } from '../components/utils/select-item';

import { SwalService } from '../components/utils/swal.service';

import { TranslateUtilsService } from '../components/utils/translate-utils.service';
import { EqualsToValidatorDirective } from '../components/validators/equals-to.validator.directive';
import { PwdValidatorDirective } from '../components/validators/pwd.validator.directive';
import { UsersService } from '../users/users.service';
import { PasswordService } from './../password/password.service';

import _isEmpty = require('lodash/isEmpty');

@Component({
	selector: 'al-profile',
	templateUrl: 'user-profile.component.html'
})

export class UserProfileComponent implements OnInit {

	resetForm: FormGroup;
	user: User;
	token: string;
	loading: boolean = false;
	selectedLanguage: SelectItems;
	languages: SelectItems;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private passwordService: PasswordService,
		private sessionService: SessionService,
		private swal: SwalService,
		private userServices: UsersService,
		private translateUtilsService: TranslateUtilsService,
		private translateService: TranslateService) {
		this.resetForm = fb.group({
			oldPwd: ['', [Validators.required, PwdValidatorDirective.validPwd]],
			pwd: ['', [Validators.required, PwdValidatorDirective.validPwd, EqualsToValidatorDirective.equalsTo('confirmedPwd', true)]],
			confirmedPwd: ['', [Validators.required, EqualsToValidatorDirective.equalsTo('pwd', false)]]
		});

		this.sessionService.session$.subscribe((newSession) => {
			if (newSession && newSession.profile && newSession.profile.language) {
				this.populateList(newSession.profile.language);
			}
		});
	}

	ngOnInit(): void {
		this.loading = true;
		const userId = this.sessionService.getSession().profile.userId;
		this.userServices.getUser(userId).subscribe((user) => {
			this.user = user.user;
			this.populateList(this.user.language);
			this.loading = false;
		});
	}

	setLanguage() {
		if (!this.selectedLanguage && !this.selectedLanguage[0]) return;
		const currentSession = this.sessionService.getSession();
		currentSession.profile.language = this.selectedLanguage[0].id.replace('locale-', '');
		this.userServices.setUserLanguage(currentSession.profile.userId, currentSession.profile.language).subscribe(() => {
			this.swal.translateSuccess('user.personal.info.language.success');
			this.reloadSession(currentSession);
		}, (err) => this.swal.translateError('commons.error', `user.personal.info.language.errors.${err}`));
	}

	onSelectLanguage(selectLang) {
		this.selectedLanguage = [selectLang];
	}

	onSubmit() {
		if (!this.resetForm.valid) return;

		const reqNew = {
			email: this.user.email,
			// TODO: Set language from global
			language: this.user.language,
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

	private generateLanguageList(): Observable<SelectItems> {
		return this.translateUtilsService.translateSelectItems('header.langselector.', this.translateService.getLangs());
	}

	private reloadSession(session: Session): void {
		this.sessionService.openSession(session);
	}

	private populateList(selectedLanguage: string): void {
		this.generateLanguageList().subscribe((languages) => {
			this.languages = languages;
			this.selectedLanguage = [this.languages.find((lang) => {
				return lang.id === 'locale-' + selectedLanguage;
			})];
		});
	}
}
