import { Component, EventEmitter, Output } from '@angular/core';

// todo: refactor this using an OpaqueToken
@Component({})
export class FocusableComponent {
	@Output('focusChange') focusChange = new EventEmitter<any>();
}
