import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import RelaxTimeService from './relax-time.service';

import SessionDurationConfigService from './session-duration-config.service';

type WorkoutSet = { repEndTime: number }[];

@Injectable({ providedIn: 'root' })
export default class TrainingSessionService {
	private _startTime?: number;
	private _history: WorkoutSet[] = [];
	private readonly _relaxEnd$ = new Subject<void>();
	private readonly _workoutDurationFinish$ = new Subject<void>();
	private readonly _forceWorkoutFinish$ = new Subject<void>();
	private readonly _workoutFinish$ = new Subject<void>();

	constructor(
		private readonly _sessionDurationConfigService: SessionDurationConfigService,
		private readonly _relaxTimeService: RelaxTimeService
	) {
		this.readSavedData();
	}

	get isStarted(): boolean {
		return this._startTime !== undefined;
	}

	get isFirstExercise(): boolean {
		return this._history.length === 0;
	}

	startSession(): void {
		this.startSession2(Date.now());
		localStorage.setItem(
			'startTime',
			this._startTime + ''
		);
	}

	getCurrentExerciseSetCount(): number {
		if (this._history.length === 0) {
			throw new Error('can not get current exercise set count');
		}
		return this._history.slice(-1)[0].length;
	}

	private startSession2(startTime: number): void {
		this._startTime = startTime;
		setTimeout(
			() => {
				this._workoutDurationFinish$.next();
			},
			this._sessionDurationConfigService.sessionDuration_m * 60 * 1000
		);
	}

	finishWorkout(): void {
		this._forceWorkoutFinish$.next();
	}

	confirmWorkoutFinish(): void {
		this._workoutFinish$.next();
		localStorage.removeItem('startTime');
		localStorage.removeItem('history');
		this._startTime = undefined;
		this._history = [];
	}

	endOfNewExercise(): void {
		const now = Date.now();
		this._history.push([
			{
				repEndTime: now
			}
		]);
		localStorage.setItem(
			'history',
			JSON.stringify(this._history)
		);
		setTimeout(
			() => {
				this._relaxEnd$.next();
			},
			this._relaxTimeService.relaxTime_s * 1000
		);
	}

	endOfNextSet(): void {
		const now = Date.now();
		if (this._history.length === 0) {
			throw new Error('can not register new set');
		}
		const set = this._history.slice(-1)[0];
		set.push({
			repEndTime: now
		});
		localStorage.setItem(
			'history',
			JSON.stringify(this._history)
		);
		setTimeout(
			() => {
				this._relaxEnd$.next();
			},
			this._relaxTimeService.relaxTime_s * 1000
		);
	}

	getTimeEllapsed_ms(): number {
		if (this._startTime === undefined) {
			throw new Error();
		}
		const now = Date.now();
		const ellapsedTime_ms = now - this._startTime;
		return ellapsedTime_ms;
	}

	/**
	 * between 0 and 1.
	 */
	getTimeEllapsedPercentage(): number {
		const timeEllapsed_ms = this.getTimeEllapsed_ms();
		const sessionDuration_m = this._sessionDurationConfigService.sessionDuration_m;
		return Math.min(
			1,
			(timeEllapsed_ms / 1000 / 60) / sessionDuration_m
		);
	}

	get relaxEnd$(): Observable<void> {
		return this._relaxEnd$.asObservable();
	}

	get workoutDurationFinish$(): Observable<void> {
		return this._workoutDurationFinish$.asObservable();
	}

	get forceWorkoutFinish$(): Observable<void> {
		return this._forceWorkoutFinish$.asObservable();
	}

	get workoutFinish$(): Observable<void> {
		return this._workoutFinish$.asObservable();
	}

	private readSavedData(): void {
		const startTime = readStartTime();
		if (startTime !== undefined) {
			this.startSession2(startTime);
		}
		const history = readHistory();
		if (history !== undefined) {
			this._history = history;
		}
	}
}

function readStartTime(): number | undefined {
	const data = localStorage.getItem('startTime');
	if (!data) {
		return undefined;
	}
	return Number(data);
}

function readHistory(): WorkoutSet[] | undefined {
	const data = localStorage.getItem('history');
	if (!data) {
		return undefined;
	}
	return JSON.parse(data);
}
