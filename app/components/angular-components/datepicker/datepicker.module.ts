import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerModule, PopoverModule } from 'ngx-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { DatePickerComponent } from './datepicker.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		FormsModule,
		DatepickerModule.forRoot(),
		PopoverModule.forRoot()
	],
	providers: [],
	declarations: [
		DatePickerComponent,
	],
	exports: [
		DatePickerComponent,
	]
})
export class DatePickerModule {
}
