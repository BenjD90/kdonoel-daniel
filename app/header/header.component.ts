import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isArray } from 'lodash';
import { Logger, LogService } from '../components/log/log.service';
import { Profile, SessionService } from '../components/session/session.service';

import { SelectItems } from '../components/utils/select-item';
import { SwalService } from '../components/utils/swal.service';

import { UsersService } from '../users/users.service';

@Component({
	selector: 'n9-header',
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.scss']

})
export class HeaderComponent {

	profile: Profile;
	loading: boolean;

	private logger: Logger;

	constructor(
			private session: SessionService,
			private router: Router,
			private translateService: TranslateService,
			private usersServices: UsersService,
			private swalService: SwalService,
			private logService: LogService) {
		this.loading = true;

		this.logger = this.logService.create('[HeaderCompoenent]');
	}

	logout() {
		this.session.logout().subscribe((p) => {
			this.router.navigate(['']);
		});
	}

	isOnHomePage() {
		return this.router.url === '/';
	}

}
