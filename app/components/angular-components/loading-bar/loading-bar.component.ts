import { Component, Input, OnInit } from '@angular/core';
import { LoadingBarEvent, LoadingBarEventType } from './loading-bar.models';
import { LoadingBarService } from './loading-bar.service';

import  _isNil = require('lodash/isNil');

/**
 * A Loading Bar component shows message loading progress bar on the top of web page.
 */
@Component({
	selector: 'al-loading-bar',
	templateUrl: './loading-bar.component.html',
	styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit {

	@Input() progress: string = '0';
	@Input() color: string = '#337ab7';
	@Input() height: string = '2px';
	@Input() show: boolean = true;

	constructor(public loadingBarService: LoadingBarService) {
	}

	ngOnInit(): void {
		this.loadingBarService.events.subscribe((event: LoadingBarEvent) => {
			if (event.type === LoadingBarEventType.PROGRESS && !_isNil(event.value)) {
				this.progress = event.value as string;
			} else if (event.type === LoadingBarEventType.COLOR) {
				this.color = event.value as string;
			} else if (event.type === LoadingBarEventType.HEIGHT) {
				this.height = event.value as string;
			} else if (event.type === LoadingBarEventType.VISIBLE) {
				this.show = event.value as boolean;
			}
		});
	}
}
