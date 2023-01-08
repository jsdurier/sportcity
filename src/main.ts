import {
	enableProdMode,
	importProvidersFrom
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';

import AppComponent from './app.component';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(
	AppComponent,
	{
		providers: [
			importProvidersFrom(
				ServiceWorkerModule.register(
					'ngsw-worker.js',
					{
						enabled: environment.production,
						/**
						 * Register the ServiceWorker as soon as the app is stable
						 * or after 30 seconds (whichever comes first).
						 */
						registrationStrategy: 'registerWhenStable:30000'
					}
				)
			)
		]
	}
);
