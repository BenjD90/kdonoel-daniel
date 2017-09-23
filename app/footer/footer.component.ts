import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { LegalNoticeComponent } from './modal/legal-notice.component';

@Component({
	selector: 'al-footer',
	templateUrl: 'footer.component.html',
	styleUrls: ['footer.component.scss']
})
export class FooterComponent {
	constructor(private modalService: BsModalService) {
	}

	showLegalNotice() {
		this.modalService.show(LegalNoticeComponent, {class: 'modal-lg'});
	}
}
