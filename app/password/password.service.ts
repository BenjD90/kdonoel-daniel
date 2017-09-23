import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiHttpClient } from '../components/http/api-http-client.service';

export interface NewPasswordRequest {
	email: string;
	signup: boolean;
}

@Injectable()
export class PasswordService {

	constructor(
		private http: ApiHttpClient) {
	}

	requestNewPwd(req: NewPasswordRequest): Observable<any> {
		return this.http.post('/ecrm/users/front/recovery', req)
			.map((res) => res.json())
			.catch((error) => Observable.throw(error.json().code || 'unknown-error'));
	}
}
