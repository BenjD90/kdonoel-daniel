import { Injectable } from '@angular/core';

@Injectable()
export class HttpUtilsService {

	constructor() {
	}

	buildParams(ids: string[]): URLSearchParams {
		const params = new URLSearchParams();
		ids.forEach((id) => {
			params.append('ids', id);
		});
		return params;
	}

	addEmptyParams(base: URLSearchParams, ...appends: string[]): URLSearchParams {
		const base2 = new URLSearchParams(base);
		appends.forEach((append) => base2.append(append, ''));
		return base2;
	}
}
