import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';

import { HomeComponent } from './home.component';
import { NewsComponent } from './news/news.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes), CommonModule, SharedModule.forRoot()],
	providers: [],
	declarations: [HomeComponent, NewsComponent, ReportsComponent],
})
export class HomeModule {}
