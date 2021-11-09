import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AlSwitchComponent } from './switch.component';

@NgModule({
	imports: [CommonModule, TranslateModule],
	declarations: [AlSwitchComponent],
	exports: [AlSwitchComponent],
})
export class AlSwitchModule {}
