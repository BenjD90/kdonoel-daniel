// tslint:disable:no-import-side-effect
import 'es6-shim';
import 'es7-shim';
import 'web-animations-js';
import 'intl';
import 'intl/locale-data/jsonp/fr.js';
import 'reflect-metadata';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';

import '@angular/platform-browser';

/**
 * Be careful to never import ust 'rxjs';
 * in this case you would be importing the *ENTIRE* library which is huge
 */
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

/*Rx static methods*/
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/never';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/zip';

/*Rx operators*/
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/delay';

// tslint:enable
