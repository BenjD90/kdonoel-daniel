import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export class CreateSessionBody {
	public email: string;
	public password?: string;
}

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

@Injectable()
export class SessionService {
	public static readonly sessionKey: string = 'session';

	public session$: BehaviorSubject<Session> = new BehaviorSubject(null as any);
	public islogged$: Observable<boolean> = this.session$.pipe(map((p) => !!p));
	public login$: Observable<any> = new Subject();
	public logout$: Observable<any> = new Subject();

	public load(): void {
		const session: Session = JSON.parse(localStorage.getItem(SessionService.sessionKey) as string);
		if (!session) return;
		if (!this.isTokenValid(session)) {
			console.error('JWT invalid');
			return;
		}
		(this.logout$ as Subject<any>).next();
		this.openSession(session);
	}

	public logout(): void {
		this.closeSession();
		(this.logout$ as Subject<any>).next();
	}

	public openSession(session: Session): void {
		localStorage.setItem(SessionService.sessionKey, JSON.stringify(session));
		this.session$.next(session);
		(this.login$ as Subject<any>).next();
	}

	public isTokenValid(session?: Session): boolean {
		session = session || this.session$.getValue();
		if (!session) return false;
		return true;
	}

	private closeSession(): void {
		localStorage.removeItem(SessionService.sessionKey);
		this.session$.next(null as any);
	}
}
