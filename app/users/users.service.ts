import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiHttpClient } from '../components/http/api-http-client.service';
import { UserResult } from './users.models';

@Injectable()
export class UsersService {

	constructor(
		private http: ApiHttpClient) {
	}

	getUser(userId: string): Observable<UserResult> {
		return this.http.get(`/ecrm/users/front/${userId}`)
			.map((res) => res.json())
			.catch((error) => Observable.throw(error.json().code || 'unknown-error'));
	}

	setUserLanguage(userId: string, language: string): Observable<void> {
		return this.http.put(`/ecrm/users/front/${userId}/language`, {language})
			.map((res) => res.json())
			.catch((error) => Observable.throw(error.json().code || 'unknown-error'));
	}
}
