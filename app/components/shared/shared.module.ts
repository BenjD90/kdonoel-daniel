import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DisclaimerComponent } from '../angular-components/disclaimers/disclaimer.component';
import { LoadingComponent } from '../angular-components/loading/loading.component';
import { AclDirective } from '../directives/acl.directive';
import { HeightEqualizerDirective } from '../directives/height-equalizer.directive';
import { ShowErrorsDirective } from '../directives/show-errors.directive';
import { EmailValidatorDirective } from '../validators/email.validator.directive';
/*
 * Here put all the shared directives, components and pipe
 * You should import this module in every module where you want to use these shared directives
 * */
@NgModule({
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		FormsModule,
		CommonModule
	],
	declarations: [
		AclDirective,
		ShowErrorsDirective,
		HeightEqualizerDirective,
		EmailValidatorDirective,
		DisclaimerComponent,
		LoadingComponent,
	],
	exports: [
		AclDirective,
		ShowErrorsDirective,
		HeightEqualizerDirective,
		ReactiveFormsModule,
		TranslateModule,
		EmailValidatorDirective,
		DisclaimerComponent,
		LoadingComponent
	]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule
		};
	}
}
