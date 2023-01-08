import { Component } from '@angular/core';

import SubtitleComponent from './subtitle.component';

@Component({
	selector: 'wp-exercises-left',
	standalone: true,
	templateUrl: './exercises-left.component.html',
	styleUrls: ['./exercises-left.component.scss'],
	imports: [
		SubtitleComponent
	]
})
export default class ExercisesLeftComponent {
	value = 5; // TODO
}
