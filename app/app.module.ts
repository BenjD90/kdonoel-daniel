import { CommonModule } from '@angular/common';
import { ErrorHandler, LOCALE_ID, NgModule, ValueProvider } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectModule } from 'ng2-select-compat';
import { ModalModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent } from './app.component';
import { LoadingBarModule } from './components/angular-components/loading-bar/loading-bar.module';
import { CoreModule } from './components/core/core.module';
import { LoggedInGuard } from './components/session/logged-in.guard';
import { SharedModule } from './components/shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { LegalNoticeComponent } from './footer/modal/legal-notice.component';
import { HeaderComponent } from './header/header.component';
import { UsersService } from './users/users.service';
import sourceMappedStackTrace = require('sourcemapped-stacktrace/dist/sourcemapped-stacktrace');

const WINDOW_PROVIDER: ValueProvider = {
	provide: Window,
	useValue: window
};

const routes: Routes = [
	{path: '', loadChildren: './home/home.module#HomeModule'},
	{path: 'login', loadChildren: './login/login.module#LoginModule'},
	{path: 'password', loadChildren: './password/password.module#PasswordModule'},
	{
		path: 'profile',
		loadChildren: './user-profile/user-profile.module#UserProfileModule',
		canActivate: [LoggedInGuard]
	},
	{
		path: 'users',
		loadChildren: './users/users.module#UsersModule',
		canActivate: [LoggedInGuard]
	}
];

export function createTranslateLoader(http: Http) {
	return new TranslateHttpLoader(http, './translations/', '.json');
}

class SourceMapDevErrorHandler extends ErrorHandler {

	constructor() {
		super(true);
	}

	handleError(error) {
		if (process.env.NODE_ENV !== 'development' || !sourceMappedStackTrace) {
			return super.handleError(error);
		}

		const originalError = this.findOriginalError(error);
		sourceMappedStackTrace.mapStackTrace(originalError, (mappedStack) => {
			const stackString = mappedStack.map((s) => s.replace('webpack:///', 'webpack:///./')).join('\n');

			console.error(error.message);
			console.error(stackString);
		}, {
			filter: (line) => {
				return !/^  -----.*/.test(line);
			},
			cacheGlobally: true
		});
	}

	findOriginalError(error) {
		if (!(error instanceof Error))
			return null;
		let e = error;
		let stack = e.stack;
		while (e instanceof Error && ((e) as any).originalError) {
			e = ((e) as any).originalError;
			if (e instanceof Error && e.stack) {
				stack = e.stack;
			}
		}
		return stack;
	}
}

@NgModule({
	providers: [
		WINDOW_PROVIDER,
		{provide: ErrorHandler, useClass: SourceMapDevErrorHandler},
		{
			provide: LOCALE_ID,
			useValue: 'fr-FR'
		},
		UsersService
	],
	imports: [
		CommonModule,
		FormsModule,
		BrowserModule,
		HttpModule,
		RouterModule.forRoot(routes),
		BrowserModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [Http]
			}
		}),
		CoreModule,
		SharedModule.forRoot(),
		SelectModule,
		BsDropdownModule.forRoot(),
		LoadingBarModule
	],
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		LegalNoticeComponent
	],
	entryComponents: [
		LegalNoticeComponent
	],
	bootstrap: [AppComponent]
})

export class AppModule {

}
