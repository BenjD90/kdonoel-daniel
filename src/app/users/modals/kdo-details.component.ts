import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Kdo } from '../../components/models/users/kdos.models';
import { User } from '../../components/models/users/users.models';
import { SwalService } from '../../components/utils/swal.service';
import { UsersService } from '../users.service';

@Component({
	selector: 'al-kdo-form',
	templateUrl: 'kdo-form.component.html',
})
export class KdoFormComponent {
	kdo: Kdo;
	onChange: Subject<User>;
	form: FormGroup;

	constructor(
		private bsModalRef: BsModalRef,
		private fb: FormBuilder,
		private usersService: UsersService,
		private swalService: SwalService,
	) {
		this.onChange = new Subject<User>();
	}

	onShow(kdo: Kdo) {
		this.kdo = kdo;
	}
}
