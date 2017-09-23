import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SwalService } from '../components/utils/swal.service';
import { EmailValidatorDirective } from '../components/validators/email.validator.directive';
import { NewPasswordRequest, PasswordService } from './password.service';

@Component({
	selector: 'al-lost',
	templateUrl: 'lost.component.html'
})
export class LostComponent {

	lostForm: FormGroup;

	// errors: string[] = [];

	constructor(
		@Inject(FormBuilder) fb: FormBuilder,
		private router: Router,
		private password: PasswordService) {
		this.lostForm = fb.group({
			email: ['', Validators.compose([Validators.required, EmailValidatorDirective.validEmail])]
		});
	}

	onSubmit() {
		if (!this.lostForm.valid) return;
		// this.errors = [];

		const req: NewPasswordRequest = {
			email: this.lostForm.value.email,
			// TODO: Set language from global
			language: 'fr-FR',
			signup: true
		};

		this.password.requestNewPwd(req as NewPasswordRequest)
			.subscribe(
				() => {
					SwalService.success('Mail envoyé!', 'Un mail vient de vous être envoyé pour réinitialiser votre mot de passe.', 2000);
					this.router.navigate(['']);
				},
				(errorCode) => SwalService.error('Une erreur s\'est produite!', errorCode)
			);
	}
}
