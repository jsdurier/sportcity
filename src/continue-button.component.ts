import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'wp-continue-button',
	standalone: true,
	templateUrl: './continue-button.component.html',
	styleUrls: ['./continue-button.component.scss'],
	imports: [
		FontAwesomeModule
	]
})
export default class ContinueButtonComponent {
	icon = icons.faArrowRight
}
