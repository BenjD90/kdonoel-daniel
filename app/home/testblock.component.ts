import { Component } from '@angular/core';
import { Session, SessionService } from '../components/session/session.service';
import _get = require('lodash/get');

@Component({
	selector: 'n9-testblock',
	templateUrl: 'testblock.component.html'
})
export class TestBlockComponent {
	userSession: Session;

	constructor(
		private session: SessionService) {
		this.session.session$.subscribe((s) => {
			this.userSession = s;
		});
	}

	isStrongAuth(): boolean {
		return _get(this.userSession, 'type') === 'strong';
	}
}
