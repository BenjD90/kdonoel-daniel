import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Profile, SessionService } from '../components/session/session.service';
import { SwalService } from '../components/utils/swal.service';
import { UsersService } from '../users/users.service';

@Component({
	selector: 'n9-header',
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.scss'],
})
export class HeaderComponent {
	profile: Profile;
	loading: boolean;

	constructor(
		private session: SessionService,
		private router: Router,
		private translateService: TranslateService,
		private usersServices: UsersService,
		private swalService: SwalService,
	) {
		this.loading = true;

		this.session.session$.subscribe((s) => {
			if (s) {
				this.profile = s.profile;
			} else {
				delete this.profile;
				this.loading = false;
			}
		});
	}

	isOnHomePage(): boolean {
		return this.router.url === '/';
	}
}
