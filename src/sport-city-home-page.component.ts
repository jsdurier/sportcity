import { Component } from '@angular/core';

import SessionPageComponent from './session-page.component';
import ShowPageService from './show-page.service';
import TrainingSessionService from './training-session.service';

@Component({
	selector: 'wp-sport-city-home-page',
	standalone: true,
	templateUrl: './sport-city-home-page.component.html',
	styleUrls: ['./sport-city-home-page.component.scss'],
	imports: [
		SessionPageComponent
	]
})
export default class SportCityHomePageComponent {
	constructor(
		private readonly _showPageService: ShowPageService,
		private readonly _trainingSessionService: TrainingSessionService
	) { }

	startTraining(): void {
		// this._trainingSessionService.startSession();
		this._showPageService.show(SessionPageComponent);
	}
}
