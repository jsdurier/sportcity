import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Unsubscribable } from 'rxjs';

import FadeOutTransitionComponent from './fade-out-transition.component';
import LayersComponent from './layers.component';
import PageContainerComponent from './page-container.component';
import PopupContainerComponent from './popup-container.component';
import SessionPageComponent from './session-page.component';
import ShowPageService from './show-page.service';
import SportCityHomeLoadingPageComponent from './sport-city-home-loading-page.component';
import SportCityHomePageComponent from './sport-city-home-page.component';
import TemplateMarker from './template-marker.directive';
import TrainingSessionService from './training-session.service';

const HOME_LOADING_PAGE_DURATION_S = 2; // TODO 2

@Component({
	selector: 'wp-sport-city-app',
	standalone: true,
	templateUrl: './sport-city-app.component.html',
	styleUrls: ['./sport-city-app.component.scss'],
	imports: [
		CommonModule,
		LayersComponent,
		PageContainerComponent,
		PopupContainerComponent,
		SportCityHomeLoadingPageComponent,
		// SportCityHomePageComponent,
		TemplateMarker
	]
})
export default class SportCityAppComponent {
	isLoadingPageDisplay = true;

	private readonly _subscriptions: Unsubscribable[] = [];

	constructor(
		private readonly _showPageService: ShowPageService,
		private readonly _trainingSessionService: TrainingSessionService
	) {
		document.oncontextmenu = () => false;
	}

	ngOnInit(): void {
		setTimeout(
			() => {
				this.goToNextPage();
			},
			HOME_LOADING_PAGE_DURATION_S * 1000
		);
		this.listenWorkoutFinish();
	}

	ngOnDestroy(): void {
		this._subscriptions.forEach(e => e.unsubscribe());
	}

	private goToNextPage(): void {
		const nextPage = this._trainingSessionService.isStarted ?
			SessionPageComponent :
			SportCityHomePageComponent;
		this._showPageService.show(
			nextPage,
			{
				out: FadeOutTransitionComponent
			}
		);
	}

	private listenWorkoutFinish(): void {
		this._subscriptions.push(this._trainingSessionService.workoutFinish$.subscribe(() => {
			this._showPageService.show(
				SportCityHomePageComponent
			);
		}));
	}
}
