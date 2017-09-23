import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { LostComponent } from './lost.component';
import { PasswordService } from './password.service';
import { ResetComponent } from './reset.component';

const routes: Routes = [
	{path: 'lost', component: LostComponent},
	{path: 'reset', component: ResetComponent},
	{path: 'signup', component: ResetComponent}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		SharedModule
	],
	providers: [
		PasswordService
	],
	declarations: [
		ResetComponent,
		LostComponent
	]
})
export class PasswordModule {
}
