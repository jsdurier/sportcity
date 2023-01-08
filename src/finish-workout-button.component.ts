import { Component } from '@angular/core';

import TrainingSessionService from './training-session.service';

@Component({
	selector: 'wp-finish-workout-button',
	standalone: true,
	templateUrl: './finish-workout-button.component.html',
	styleUrls: ['./finish-workout-button.component.scss']
})
export default class FinishWorkoutButtonComponent {
	constructor(
		private readonly _trainingSessionService: TrainingSessionService
	) { }

	finishWorkout(): void {
		this._trainingSessionService.finishWorkout();
	}
}
