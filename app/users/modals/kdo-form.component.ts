import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { User } from '../../components/models/users/users.models';
import { SwalService } from '../../components/utils/swal.service';
import { UsersService } from '../users.service';

@Component({
	selector: 'al-kdo-form',
	templateUrl: 'kdo-form.component.html'
})
export class KdoFormComponent {
	onChange: Subject<User>;
	form: FormGroup;

	constructor(
		private bsModalRef: BsModalRef,
		private fb: FormBuilder,
		private usersService: UsersService,
		private swalService: SwalService) {
		this.onChange = new Subject<User>();

		this.form = this.fb.group({
			title: this.fb.control('', [Validators.required]),
			description: this.fb.control('', [])
		});
	}

	onSubmit() {
		this.usersService.addKdo(this.form.value).subscribe((newUsers) => {
			this.swalService.translateSuccess('kdo.add.confirm.success');
			this.onChange.next(newUsers);
			this.bsModalRef.hide();
		}, (errorCode) => {
			this.swalService.translateError('commons.error', 'kdo.add.confirm.error.' + errorCode);
		});
	}
}
