import { Component } from '@angular/core';

import CompleteButtonComponent from './complete-button.component';
import ExercisesLeftComponent from './exercises-left.component';
import FinishWorkoutButtonComponent from './finish-workout-button.component';
import PopupService from './popup.service';
import RepetitionsCountSelectionPopupComponent from './repetitions-count-selection-popup.component';

@Component({
	selector: 'wp-squat-exercise-page',
	standalone: true,
	templateUrl: './squat-exercise-page.component.html',
	styleUrls: ['./squat-exercise-page.component.scss'],
	imports: [
		CompleteButtonComponent,
		ExercisesLeftComponent,
		FinishWorkoutButtonComponent
	]
})
export default class SquatExercisePageComponent {
	constructor(
		private readonly _popupService: PopupService
	) { }

	onComplete(): void {
		const popupRef = this._popupService.open(RepetitionsCountSelectionPopupComponent);
		popupRef.componentRef.instance.valueChange.subscribe(e => {
			popupRef.close();
			console.log('repetitions count', e);
		});
	}
}
