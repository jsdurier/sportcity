import { Component } from '@angular/core';

import CompleteButtonComponent from './complete-button.component';
import ExercisesLeftComponent from './exercises-left.component';
import FinishWorkoutButtonComponent from './finish-workout-button.component';
import RelaxComponent from './relax.component';
import ShowPageService from './show-page.service';
import TrainingSessionService from './training-session.service';

@Component({
	selector: 'wp-first-exercise',
	standalone: true,
	templateUrl: './first-exercise.component.html',
	styleUrls: ['./first-exercise.component.scss'],
	imports: [
		CompleteButtonComponent,
		ExercisesLeftComponent,
		FinishWorkoutButtonComponent
	]
})
export default class FirstExerciseComponent {
	constructor(
		private readonly _showPageService: ShowPageService,
		private readonly _trainingSessionService: TrainingSessionService
	) {}

	onComplete(): void {
		this._trainingSessionService.endOfNewExercise();
		this._showPageService.show(RelaxComponent);
	}
}
