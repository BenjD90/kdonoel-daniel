import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
	selector: 'al-kdo-form',
	templateUrl: 'kdo-form.component.html'
})
export class KdoFormComponent {
	constructor(public bsModalRef: BsModalRef) {}
}
