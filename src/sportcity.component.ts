import { Component } from '@angular/core';

import BackgroundComponent from './background.component';
import CenterContentComponent from './center-content.component';
import SportcityTitleComponent from './sportcity-title.component';

@Component({
	selector: 'wp-sportcity',
	standalone: true,
	templateUrl: './sportcity.component.html',
	styleUrls: ['./sportcity.component.scss'],
	imports: [
		BackgroundComponent,
		CenterContentComponent,
		SportcityTitleComponent
	]
})
export default class SportcityComponent { }
