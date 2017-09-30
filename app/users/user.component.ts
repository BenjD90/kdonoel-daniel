import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { User } from '../components/models/users/users.models';
import { UsersService } from './users.service';
import { KdoFormComponent } from './modals/kdo-form.component';

@Component({
	selector: 'al-user',
	templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {
	user: User;
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
				this.user = user;
			});
		});
	}

	addKdo(): void {
		const modal = this.modalService.show(KdoFormComponent);
		modal.content.onChange.subscribe((newUser: User) => {
			this.user = newUser;
		});
	}
}
