import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { UserComponent } from './user.component';
import { KdoFormComponent } from './modals/kdo-form.component';
import { ModalModule } from 'ngx-bootstrap';

const routes: Routes = [
	{path: ':userId', component: UserComponent}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		SharedModule.forRoot(),
		ModalModule.forRoot(),
	],
	providers: [],
	declarations: [
		UserComponent,
		KdoFormComponent
	],
	entryComponents: [
		KdoFormComponent
	]
})
export class UsersModule {
}
