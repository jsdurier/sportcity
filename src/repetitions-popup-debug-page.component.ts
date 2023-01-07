import { Component } from '@angular/core';

import ExercisePageComponent from './exercise-page.component';
import PopupContainerComponent from './popup-container.component';
import RepetitionsCountSelectionPopupComponent from './repetitions-count-selection-popup.component';

@Component({
	selector: 'wp-repetitions-popup-debug-page',
	standalone: true,
	templateUrl: './repetitions-popup-debug-page.component.html',
	styleUrls: ['./repetitions-popup-debug-page.component.scss'],
	imports: [
		ExercisePageComponent,
		PopupContainerComponent,
		RepetitionsCountSelectionPopupComponent
	]
})
export default class RepetitionsPopupDebugPageComponent { }
