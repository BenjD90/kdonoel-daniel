import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { Kdo } from '../../components/models/users/kdos.models';
import { User } from '../../components/models/users/users.models';
import { KdoFormComponent } from '../modals/kdo-form.component';
import { UsersService } from '../users.service';

@Component({
	selector: 'al-user',
	templateUrl: 'kdo.component.html'
})
export class KdoComponent implements OnInit {
	kdo: Kdo;
	index: number;
	loading: boolean = true;

	constructor(
		private route: ActivatedRoute,
		private usersService: UsersService,
		private modalService: BsModalService) {
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.usersService.getUser(params['userId']).subscribe((user) => {
				this.loading = false;
				this.index = Number.parseInt(params['kdoIndex']);
				this.kdo = user.kdos[this.index];
			});
		});
	}

	edit(kdo: Kdo, index: number): void {
		const modal = this.modalService.show(KdoFormComponent);
		modal.content.onShow(kdo, index);
		modal.content.onChange.subscribe((newUser: User) => {
			this.kdo = newUser.kdos[this.index];
		});
	}
}
