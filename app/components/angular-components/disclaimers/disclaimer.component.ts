import { Component, Input } from '@angular/core';
import { DisclaimerType } from './disclaimers';

@Component({
	selector: 'al-disclaimer',
	templateUrl: './disclaimer.component.html',
	styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent {
	@Input('label') label: string = '';
	@Input('type') type: DisclaimerType = 'info';
}
