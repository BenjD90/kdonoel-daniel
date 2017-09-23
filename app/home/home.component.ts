import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Profile, SessionService } from '../components/session/session.service';

@Component({
	selector: 'n9-home',
	templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

	profile: Profile;
	subscription: Subscription;

	constructor(
		private session: SessionService) {
	}

	ngOnInit(): void {
		this.subscription = this.session.session$.subscribe((s) => {
			if (s) {
				this.profile = s.profile;
			} else {
				delete this.profile;
			}
		});
	}

	ngOnDestroy(): void {
		if (this.subscription) this.subscription.unsubscribe();
	}
}
