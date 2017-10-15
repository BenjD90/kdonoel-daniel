import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Kdo } from '../components/models/users/kdos.models';
import { User } from '../components/models/users/users.models';
import { SessionService } from '../components/session/session.service';
import { KdoFormComponent } from './modals/kdo-form.component';
import { UsersService } from './users.service';

@Component({
	selector: 'al-user',
	templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {
	user: User;
	loading: boolean = true;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private usersService: UsersService,
		private modalService: BsModalService,
		private sessionService: SessionService) {
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.usersService.getUser(params['userId']).subscribe((user) => {
				this.loading = false;
				this.user = user;
			});
		});
	}

	isConnectedUser(): Observable<boolean> {
		return this.sessionService.session$.map((session) => {
			return !this.loading && this.user._id === session.profile._id;
		});
	}

	addKdo(): void {
		const modal = this.modalService.show(KdoFormComponent);
		modal.content.onShow();
		modal.content.onChange.subscribe((newUser: User) => {
			this.user = newUser;
		});
	}

	edit(kdo: Kdo, index: number): void {
		const modal = this.modalService.show(KdoFormComponent);
		modal.content.onShow(kdo, index);
		modal.content.onChange.subscribe((newUser: User) => {
			this.user = newUser;
		});
	}

	showKdo(index: number): void {
		this.router.navigate([index], {
			relativeTo: this.route
		});
	}
}
