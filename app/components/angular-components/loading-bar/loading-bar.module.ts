import { NgModule } from '@angular/core';
import { LoadingBarComponent } from './loading-bar.component';
import { LoadingBarService } from './loading-bar.service';

@NgModule({
	declarations: [
		LoadingBarComponent
	],
	exports: [
		LoadingBarComponent
	],
	providers: [
		LoadingBarService
	]
})
export class LoadingBarModule {
}
