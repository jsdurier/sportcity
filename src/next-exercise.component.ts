import { Component } from '@angular/core';

import CompleteButtonComponent from './complete-button.component';
import ExercisesLeftComponent from './exercises-left.component';
import FinishWorkoutButtonComponent from './finish-workout-button.component';
import RelaxComponent from './relax.component';
import SetSummaryComponent from './set-summary.component';
import ShowPageService from './show-page.service';
import TrainingSessionService from './training-session.service';

@Component({
	selector: 'wp-next-exercise',
	standalone: true,
	templateUrl: './next-exercise.component.html',
	styleUrls: ['./next-exercise.component.scss'],
	imports: [
		CompleteButtonComponent,
		ExercisesLeftComponent,
		FinishWorkoutButtonComponent,
		SetSummaryComponent
	]
})
export default class NextExerciseComponent {
	constructor(
		private readonly _showPageService: ShowPageService,
		private readonly _trainingSessionService: TrainingSessionService
	) {}

	newSet(): void {
		this._trainingSessionService.endOfNextSet();
		this._showPageService.show(RelaxComponent);
	}

	newExercise(): void {
		this._trainingSessionService.endOfNewExercise();
		this._showPageService.show(RelaxComponent);
	}
}
