import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Kdo } from '../../components/models/users/kdos.models';
import { User } from '../../components/models/users/users.models';
import { SwalService } from '../../components/utils/swal.service';
import { UsersService } from '../users.service';

@Component({
	selector: 'al-kdo-form',
	templateUrl: 'kdo-form.component.html'
})
export class KdoFormComponent {
	kdoIndex: number;
	onChange: Subject<User>;
	form: FormGroup;
	modalType: 'edit' | 'new' = 'edit';
	loading: boolean = true;
	kdo: Kdo;

	constructor(
		private bsModalRef: BsModalRef,
		private fb: FormBuilder,
		private usersService: UsersService,
		private swalService: SwalService) {
		this.onChange = new Subject<User>();
	}

	onSubmit() {
		if (this.modalType === 'new') {
			this.usersService.addKdo(this.form.value).subscribe((newUsers) => {
				this.swalService.translateSuccess('kdo.add.confirm.success');
				this.onChange.next(newUsers);
				this.bsModalRef.hide();
			}, (errorCode) => {
				this.swalService.translateError('commons.error', 'kdo.add.confirm.error.' + errorCode);
			});
		} else {
			this.usersService.editKdo(this.kdoIndex, this.form.value).subscribe((newUsers) => {
				this.swalService.translateSuccess('kdo.edit.confirm.success');
				this.onChange.next(newUsers);
				this.bsModalRef.hide();
			}, (errorCode) => {
				this.swalService.translateError('commons.error', 'kdo.edit.confirm.error.' + errorCode);
			});
		}
	}

	onShow(kdo?: Kdo, kdoIndex?: number) {
		this.kdo = kdo;
		this.kdoIndex = kdoIndex;

		if (!kdo) {
			this.modalType = 'new';
			kdo = {
				title: ''
			};
		}

		this.form = this.fb.group({
			title: this.fb.control(kdo.title, [Validators.required]),
			description: this.fb.control(kdo.description, [])
		});

		this.loading = false;
	}
}
