import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiHttpClient } from '../components/http/api-http-client.service';
import { Kdo } from '../components/models/users/kdos.models';
import { User } from '../components/models/users/users.models';

@Injectable()
export class UsersService {

	private usersCache: { [id: string]: User };

	constructor(
		private http: ApiHttpClient) {
		this.usersCache = {};
	}

	getUser(userId: string): Observable<User> {
		if (this.usersCache[userId]) {
			return Observable.of(this.usersCache[userId]);
		}

		return this.http.get(`/users/${userId}`)
			.map((res) => res.json())
			.map((res: User) => {
				this.usersCache[res._id] = res;
				return res;
			})
			.catch((error) => Observable.throw(error.json().code || 'unknown-error'));
	}

	getUsers(): Observable<User[]> {
		return this.http.get(`/users`)
			.map((res) => res.json())
			.catch((error) => Observable.throw(error.json().code || 'unknown-error'));
	}

	addKdo(kdo: Kdo): Observable<User> {
		return this.http.post('/users/kdo', kdo)
			.map((res) => res.json())
			.map((res: User) => {
				this.usersCache[res._id] = res;
				return res;
			})
			.catch((error) => Observable.throw(error.json().code || 'unknown-error'));
	}

	editKdo(index: number, kdo: Kdo): Observable<User> {
		return this.http.put('/users/kdo/' + index, kdo)
			.map((res) => res.json())
			.map((res: User) => {
				this.usersCache[res._id] = res;
				return res;
			})
			.catch((error) => Observable.throw(error.json().code || 'unknown-error'));
	}
}
