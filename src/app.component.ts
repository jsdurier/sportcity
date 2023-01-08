import { Component } from '@angular/core';

import SportCityAppComponent from './sport-city-app.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [
		SportCityAppComponent
	]
})
export default class AppComponent {
  title = 'sportcity';
}
