import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Profile, SessionService } from '../components/session/session.service';
import { UsersService } from '../users/users.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../components/models/users/users.models';

@Component({
	selector: 'n9-home',
	templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

	profile: Profile;
	subscription: Subscription;
	usersObservable: Observable<User[]>;

	constructor(
		private session: SessionService,
		private usersService: UsersService) {
	}

	ngOnInit(): void {
		this.subscription = this.session.session$.subscribe((s) => {
			if (s) {
				this.profile = s.profile;
			} else {
				delete this.profile;
			}
		});

		this.usersObservable = this.usersService.getUsers();
	}

	ngOnDestroy(): void {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
