import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import TrainingSessionService from './training-session.service';

@Component({
	selector: 'wp-force-workout-finish-popup',
	standalone: true,
	templateUrl: './force-workout-finish-popup.component.html',
	styleUrls: ['./force-workout-finish-popup.component.scss']
})
export default class ForceWorkoutFinishPopupComponent {
	private readonly _cancel$ = new Subject<void>();
	private readonly _submit$ = new Subject<void>();

	constructor(
		private readonly _trainingSessionService: TrainingSessionService
	) { }

	confirmWorkoutFinish(): void {
		this._trainingSessionService.confirmWorkoutFinish();
		this._submit$.next();
	}

	cancel(): void {
		this._cancel$.next();	
	}

	get cancel$(): Observable<void> {
		return this._cancel$.asObservable();
	}

	get submit$(): Observable<void> {
		return this._submit$.asObservable();
	}
}
