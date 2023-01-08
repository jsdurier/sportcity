import { Component } from '@angular/core';
import { Unsubscribable } from 'rxjs';

import BackgroundComponent from './background-2';
import ExercisesLeftComponent from './exercises-left.component';
import FinishWorkoutButtonComponent from './finish-workout-button.component';
import FirstExerciseComponent from './first-exercise.component';
import ForceWorkoutFinishPopupComponent from './force-workout-finish-popup.component';
import LayersComponent from './layers.component';
import NextExerciseComponent from './next-exercise.component';
import PageContainerComponent from './page-container.component';
import SessionContainerComponent from './session-container.component';
import SessionTimeComponent from './session-time.component';
import ShowPageService from './show-page.service';
import TemplateMarker from './template-marker.directive';
import TrainingSessionService from './training-session.service';
import PopupService from './popup.service';
import WorkoutFinishPopupComponent from './workout-finish-popup.component';

@Component({
	selector: 'wp-session-page',
	standalone: true,
	templateUrl: './session-page.component.html',
	styleUrls: ['./session-page.component.scss'],
	imports: [
		BackgroundComponent,
		ExercisesLeftComponent,
		FinishWorkoutButtonComponent,
		FirstExerciseComponent,
		LayersComponent,
		NextExerciseComponent,
		PageContainerComponent,
		SessionContainerComponent,
		SessionTimeComponent,
		TemplateMarker
	],
	providers: [
		ShowPageService
	]
})
export default class SessionPageComponent {
	private _subscriptions: Unsubscribable[] = [];

	constructor(
		private readonly _trainingSessionService: TrainingSessionService,
		private readonly _showPageService: ShowPageService,
		private readonly _popupService: PopupService
	) {
		// FirstExerciseComponent
	}

	ngOnInit(): void {
		if (!this._trainingSessionService.isStarted) {
			this._trainingSessionService.startSession();
		}
		if (this._trainingSessionService.isFirstExercise) {
			this._showPageService.show(FirstExerciseComponent);
		} else {
			this._showPageService.show(NextExerciseComponent);
		}
		this._subscriptions.push(this._trainingSessionService.relaxEnd$.subscribe(() => {
			this._showPageService.show(NextExerciseComponent);
		}));
		this.listenWorkoutFinish();
		this.listenForceWorkoutFinish();
	}

	ngOnDestroy(): void {
		this._subscriptions.forEach(e => e.unsubscribe());
	}

	private listenWorkoutFinish(): void {
		this._subscriptions.push(this._trainingSessionService.workoutDurationFinish$.subscribe(() => {
			const ref = this._popupService.open(WorkoutFinishPopupComponent);
			ref.componentRef.instance.continue$.subscribe(() => {
				ref.close();
			});
			ref.componentRef.instance.finish$.subscribe(() => {
				ref.close();
			});
		}));
	}

	private listenForceWorkoutFinish(): void {
		this._subscriptions.push(this._trainingSessionService.forceWorkoutFinish$.subscribe(() => {
			const ref = this._popupService.open(ForceWorkoutFinishPopupComponent);
			ref.componentRef.instance.cancel$.subscribe(() => {
				ref.close();
			});
			ref.componentRef.instance.submit$.subscribe(() => {
				ref.close();
			});
		}));
	}
}
