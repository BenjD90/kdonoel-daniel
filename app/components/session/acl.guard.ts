import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Logger, LogService } from '../log/log.service';
import { SwalService } from '../utils/swal.service';
import { SessionService } from './session.service';

@Injectable()
export class AclGuard implements CanActivate {
	private logger: Logger;

	constructor(
			private session: SessionService,
			private router: Router,
			private logService: LogService,
			private translateService: TranslateService) {
		this.logger = logService.create('[AclGuard]');
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		return this.session.islogged$
				.map((isLogged) => {
					if (isLogged) {
						const isAuthorised = this.session.checlAclAgainstSession(route.data.acl);
						if (!isAuthorised) {
							SwalService.error(this.translateService.instant('commons.errors.unauthorised'));
						}

						return isAuthorised;
					}
					this.router.navigate(['']);
					return false;
				})
				.take(1);
	}
}
