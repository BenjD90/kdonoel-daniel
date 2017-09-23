import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs, Response, ResponseOptions } from '@angular/http';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LogService } from '../log/log.service';
import _cloneDeep = require("lodash/cloneDeep");
import _assignIn = require("lodash/assignIn");

export interface CustomRequestOptions {
	url: string;
	options: RequestOptionsArgs;
}

@Injectable()
export class ApiHttpClient {

	public static readonly CONTENT_TYPE_HEADER = 'Content-Type';
	public static readonly AUTHORIZATION_HEADER = 'Authorization';
	public static readonly CONTENT_TYPE_APPLICATION_JSON = 'application/json';
	public static readonly FORM_DATA = 'multipart/form-data';
	public static readonly FORM_URL_ENCODED = 'application/x-www-form-urlencoded';

	static createFromResponse(observable: Observable<any>, success?: (response: any) => any): Observable<any> {
		return new Observable((observer: any) => {
			return observable.subscribe((response) => {
				if (success) return observer.next(success(response));
				else return observer.next(response);
			}, (error) => {
				return observer.error(error);
			}, () => {
				return observer.complete();
			});
		});
	}

	private defaultOptions: RequestOptionsArgs = {};
	private _baseUrl = '';

	private onRequestStart: Subject<any>;
	private onRequestEndSuccess: Subject<any>;
	private onRequestEndError: Subject<any>;

	private interceptors: any[] = [];

	constructor(
			private http: Http,
			private logService: LogService) {
		this.addDefaultHeader(ApiHttpClient.CONTENT_TYPE_HEADER, ApiHttpClient.CONTENT_TYPE_APPLICATION_JSON);
		this.onRequestStart = new Subject();
		this.onRequestEndSuccess = new Subject();
		this.onRequestEndError = new Subject();
	}

	addDefaultHeader(name: string, value: string) {
		this.defaultOptions.headers = this.defaultOptions.headers || new Headers();
		this.defaultOptions.headers.append(name, value);
	}

	deleteDefaultHeader(name: string) {
		this.defaultOptions.headers = this.defaultOptions.headers || new Headers();
		this.defaultOptions.headers.delete(name);
	}

	getDefaultRequestOptions(): RequestOptionsArgs {
		// lodash does not handle Map / Set copy, so we got to manually copy it
		const ret = _cloneDeep(this.defaultOptions);
		ret.headers = new Headers(this.defaultOptions.headers);
		return ret;
	}

	get baseUrl() {
		return this._baseUrl;
	}

	set baseUrl(basePath: string) {
		if (!basePath) {
			basePath = '';
		}

		this._baseUrl = basePath;
	}

	get(url: string, options?: RequestOptionsArgs): Observable<Response> {
		const opt = this.processRequestOptions(url, options);

		return this.handleResponse(this.http.get(opt.url, opt.options));
	}

	post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
		const opt = this.processRequestOptions(url, options);

		return this.handleResponse(this.http.post(opt.url, body, opt.options));
	}

	put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
		const opt = this.processRequestOptions(url, options);

		return this.handleResponse(this.http.put(opt.url, body, opt.options));
	}

	delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
		const opt = this.processRequestOptions(url, options);

		return this.handleResponse(this.http.delete(opt.url, opt.options));
	}

	postFormData(url: string, formData: FormData): Observable<any> {
		return this.handleResponse(this.sendFormData(url, formData, 'POST'));
	}

	getFormData(url: string): Observable<any> {
		return this.sendFormData(url, null, 'GET');
	}

	sendFormData(url: string, formData: FormData, type: string/*, options?: RequestOptionsArgs*/): Observable<any> {
		const xhr = new XMLHttpRequest();

		(this.onRequestStart as Subject<any>).next({});

		// options = this.loadRequestOptions(options);
		const options = this.getDefaultRequestOptions();

		const response = Observable.fromPromise(new Promise((resolve, reject) => {
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						this.onRequestEndSuccess.next(xhr);
						resolve(JSON.parse(xhr.response));
					} else if (xhr.status === 204) {
						this.onRequestEndSuccess.next({});
						resolve({});
					} else {
						this.onRequestEndError.next(xhr);
						reject(xhr.response);
					}
				}
			};

			xhr.open(type, url, true);

			if (options && options.headers) {
				options.headers.keys().forEach((key: string) => {
					xhr.setRequestHeader(key, options.headers.get(key));
				});
			}

			xhr.send(formData);
		}));

		return response;
	}

	patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
		const opt = this.processRequestOptions(url, options);

		return this.handleResponse(this.http.patch(opt.url, body, opt.options));
	}

	head(url: string, options?: RequestOptionsArgs): Observable<Response> {
		const opt = this.processRequestOptions(url, options);

		return this.handleResponse(this.http.head(opt.url, opt.options));
	}

	options(url: string, options?: RequestOptionsArgs): Observable<Response> {
		const opt = this.processRequestOptions(url, options);

		return this.handleResponse(this.http.options(opt.url, opt.options));
	}

	addInterceptor(next: (x: any) => void, error?: (e: any) => void): void {
		this.interceptors.push({
			next,
			error
		});
	}

	handleInterceptor(interceptors: any[], observable: Observable<any>): Observable<any> {
		if (interceptors.length) {
			return this.handleInterceptor(interceptors.slice(1, interceptors.length), observable.catch((error) => {
				if (!interceptors[0].error) return Observable.throw(error);
				return interceptors[0].error(error) || Observable.throw(error);
			})).flatMap((response) => {
				if (!interceptors[0].next) return Observable.of(response);
				return interceptors[0].next(response) || Observable.of(response);
			});
		} else {
			return observable;
		}
	}

	handleResponse(observable: Observable<Response>): Observable<any> {
		this.onRequestStart.next();

		return this.handleInterceptor(this.interceptors, observable).do((response: Response) => {
			this.onRequestEndSuccess.next(response);
		}).catch((error: Response) => {
			this.logService.error('response-error', error);
			if (error.json().code) {
				const body = error.json();
				body.code = (body.code as string).replace(' ', '-');
				error = new Response(new ResponseOptions({
					body: JSON.stringify(body),
					status: error.status,
					headers: error.headers,
					statusText: error.statusText,
					type: error.type,
					url: error.url
				}));
			}
			this.onRequestEndError.next(error);
			if (error.status === 401) {
				if (error.json().code === 'invalid_token' || error.json().code === 'jwt-expired') {
					return Observable.never();
				} else {
					return Observable.throw(error);
				}
			}
			return Observable.throw(error);
		});
	}

	requestStart(): Observable<any> {
		return this.onRequestStart.asObservable();
	}

	requestEndSuccess(): Observable<any> {
		return this.onRequestEndSuccess.asObservable();
	}

	requestEndError(): Observable<any> {
		return this.onRequestEndError.asObservable();
	}

	protected processRequestOptions(url: string, options?: RequestOptionsArgs): CustomRequestOptions {
		options = _assignIn(this.getDefaultRequestOptions(), options);

		if (this.baseUrl[this.baseUrl.length - 1] === '/' && url[0] === '/') url = this.baseUrl + url.substring(1);
		else url = this.baseUrl + url;
		return { url, options };
	}
}
