import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import TrainingSessionService from './training-session.service';

@Component({
	selector: 'wp-workout-finish-popup',
	standalone: true,
	templateUrl: './workout-finish-popup.component.html',
	styleUrls: ['./workout-finish-popup.component.scss']
})
export default class WorkoutFinishPopupComponent {
	private readonly _continue$ = new Subject<void>();
	private readonly _finish$ = new Subject<void>();

	constructor(
		private readonly _trainingSessionService: TrainingSessionService
	) { }

	confirmFinish(): void {
		this._trainingSessionService.confirmWorkoutFinish();
		this._finish$.next();
	}

	continue(): void {
		this._continue$.next();
	}

	get continue$(): Observable<void> {
		return this._continue$.asObservable();
	}

	get finish$(): Observable<void> {
		return this._finish$.asObservable();
	}
}
