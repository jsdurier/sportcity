import { Component } from '@angular/core';

import PopupContainerComponent from './popup-container.component';
import PopupService from './popup.service';
import RepetitionsCountSelectionPopupComponent from './repetitions-count-selection-popup.component';
import SquatExercisePageComponent from './squat-exercise-page.component';

@Component({
	selector: 'wp-squat-exercise-debug-page',
	standalone: true,
	templateUrl: './squat-exercise-debug-page.component.html',
	styleUrls: ['./squat-exercise-debug-page.component.scss'],
	imports: [
		PopupContainerComponent,
		RepetitionsCountSelectionPopupComponent,
		SquatExercisePageComponent
	]
})
export default class SquatExerciseDebugPageComponent {
	
}
