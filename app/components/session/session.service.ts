import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ApiHttpClient } from '../http/api-http-client.service';
import { Logger, LogService } from '../log/log.service';
import { StoreService } from '../store/store.service';
import { SwalService } from '../utils/swal.service';

export interface Profile {
	firstName: string;
	lastName: string;
	email: string;
	_id: string;
}

export interface Session {
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
		return this._session$ as Observable<Session>;
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
		return this.http.post('/sessions', credentials)
				.map((res) => res.json())
				.catch((error) => Observable.throw(error.json()));
	}

	logout(): Observable<any> {
		this.closeSession();
		return Observable.of({});
	}

	openSession(session: Session) {
		this.store.set(this.sessionKey, session);
		this.http.deleteDefaultHeader(ApiHttpClient.AUTHORIZATION_HEADER);
		this.http.addDefaultHeader(ApiHttpClient.AUTHORIZATION_HEADER, ` ${session.token}`);
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
