import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import FadeOutTransitionComponent from './fade-out-transition.component';
import LayersComponent from './layers.component';
import PageContainerComponent from './page-container.component';
import ShowPageService from './show-page.service';
import SportCityHomeLoadingPageComponent from './sport-city-home-loading-page.component';
import SportCityHomePageComponent from './sport-city-home-page.component';
import TemplateMarker from './template-marker.directive';

const HOME_LOADING_PAGE_DURATION_S = 2;

@Component({
	selector: 'wp-sport-city-app',
	standalone: true,
	templateUrl: './sport-city-app.component.html',
	styleUrls: ['./sport-city-app.component.scss'],
	imports: [
		CommonModule,
		LayersComponent,
		PageContainerComponent,
		SportCityHomeLoadingPageComponent,
		// SportCityHomePageComponent,
		TemplateMarker
	]
})
export default class SportCityAppComponent {
	isLoadingPageDisplay = true;

	constructor(
		private readonly _showPageService: ShowPageService
	) { }

	ngOnInit(): void {
		setTimeout(
			() => {
				this.goToHome();
			},
			HOME_LOADING_PAGE_DURATION_S * 1000
		);
	}

	private goToHome(): void {
		this._showPageService.show(
			SportCityHomePageComponent,
			{
				out: FadeOutTransitionComponent
			}
		);
	}
}
