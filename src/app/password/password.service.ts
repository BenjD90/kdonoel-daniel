import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class PasswordResetRequest {
	public oldPassword: string;
	public newPassword: string;
}

@Injectable()
export class PasswordService {
	constructor(private http: HttpClient) {}

	resetPassword(req: PasswordResetRequest): Observable<any> {
		return this.http.post('/users/reset/password', req);
	}
}
