import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiHttpClient } from '../components/http/api-http-client.service';
import { User } from '../components/models/users/users.models';

@Injectable()
export class UsersService {

	constructor(
		private http: ApiHttpClient) {
	}

	getUser(userId: string): Observable<User> {
		return this.http.get(`/users/${userId}`)
			.map((res) => res.json())
			.catch((error) => Observable.throw(error.json().code || 'unknown-error'));
	}

	getUsers(): Observable<User[]> {
		return this.http.get(`/users`)
			.map((res) => res.json())
			.catch((error) => Observable.throw(error.json().code || 'unknown-error'));
	}
}
