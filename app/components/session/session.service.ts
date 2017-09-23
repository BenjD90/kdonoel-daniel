import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ApiHttpClient } from '../http/api-http-client.service';
import { Logger, LogService } from '../log/log.service';
import { StoreService } from '../store/store.service';
import { SwalService } from '../utils/swal.service';
import _map = require('lodash/map');

export interface Address {
	line: string;
	line2?: string;
	zipCode: string;
	city: string;
}

export interface Profile {
	auth: string; // TODO: Move this field
	firstname: string;
	lastname: string;
	email: string;
	address: Address;
	userId: string;
	perms: {
		action: string,
		user?: string
	}[];
	language: string;
}

export interface Session {
	type: string;
	token: string;
	profile: Profile;
}

export interface Credentials {
	email: string;
	password: string;
}

export interface ResetPasswordRequest {
	signup: boolean;
	user: {
		userId?: string;
		token: string;
		password: string;
	};
	oldPassword?: string;
}

@Injectable()
export class SessionService {

	// tslint:disable:member-ordering
	private _session$: BehaviorSubject<Session> = new BehaviorSubject(null);
	public get session$(): Observable<Session> {
		return this._session$;
	}

	public islogged$: Observable<boolean> = this.session$.map((p) => !!p);
	public login$: Observable<any> = new Subject();
	public logout$: Observable<any> = new Subject();
	private sessionKey = "session";

	private logger: Logger;
	// tslint:enable

	constructor(
			private store: StoreService,
			private http: ApiHttpClient,
			private logService: LogService,
			private translateService: TranslateService,
			private router: Router,
			private swal: SwalService) {
		this.logger = logService.create('[SessionService]');
		this.http.requestEndError().subscribe((err) => {
			if (err.status === 401) {
				if (err.json().code === 'invalid_token' || err.json().code === 'jwt-expired') {
					this.closeSession();
					this.swal.translateInfo('sessions.errors.invalid_token');
					this.router.navigate(['/']);
				}
			}
		});
		this.http.requestEndSuccess().subscribe((res) => {
			const session = JSON.parse(res.headers.get('Session'));
			if (session && session.token && session.profile) {
				this.closeSession();
				this.openSession(session);
				(this.login$ as Subject<any>).next();
			}
		});
	}

	getSession(): Session {
		return this._session$.getValue();
	}

	load() {
		const session: Session = this.store.get(this.sessionKey);
		if (!session) return;
		this.openSession(session);
	}

	login(credentials: Credentials): Observable<any> {
		return this.http.post("/ecrm/sessions/front", credentials)
				.map((res) => res.json())
				.catch((error) => Observable.throw(error.json()));
	}

	logout(): Observable<any> {
		this.closeSession();
		return Observable.of({});
	}

	checlAclAgainstSession(acl): boolean {
		if (!acl) {
			this.logger.warn('Missing acl in route data');
			return false;
		}
		if (acl && !this.getSession()) {
			this.logger.warn('Missing session.');
			return false;
		}
		// console.log('--session--', this.getSession());
		// console.log('--acl--', acl);

		const userPermsMatchingActions = this.getSession().profile.perms.filter((feature) => {
			return acl.perms.filter((featureRequired) => {
						return featureRequired.action === feature.action;
					}).length > 0;
		});

		// console.log('--userPermsMatchingActions--', userPermsMatchingActions);

		return userPermsMatchingActions.filter((userPerm) => {
					return acl.perms
									.filter((perm) => perm.action === userPerm.action)
									.filter((perm) => {
										if (perm.user && userPerm.user === undefined) {
											// Reject user
											this.logger.info("Not authorised due to user property");
											return false;
										}
										if (perm.user === null && userPerm.user !== null) {
											return false;
										}
										return true;
									}).length > 0;
				}).length > 0;
	}

	openSession(session: Session) {
		this.store.set(this.sessionKey, session);
		this.http.deleteDefaultHeader(ApiHttpClient.AUTHORIZATION_HEADER);
		this.http.addDefaultHeader(ApiHttpClient.AUTHORIZATION_HEADER, `Bearer ${session.token}`);
		this._session$.next(session);
	}

	resetPassword(req: ResetPasswordRequest): Observable<any> {
		return this.http.post("/ecrm/users/front/reset/password", req)
				.map((res) => res.json())
				.catch((error) => Observable.throw(error.json().code || 'unknown-error'));
	}

	private closeSession() {
		this.store.del(this.sessionKey);
		this._session$.next(null);
		(this.logout$ as Subject<any>).next();
		this.http.deleteDefaultHeader(ApiHttpClient.AUTHORIZATION_HEADER);
	}
}
