import { CommonModule } from '@angular/common';
import {
	Component,
	HostListener,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	TemplateRef
} from '@angular/core';
import {
	animate,
	AnimationEvent,
	style,
	transition,
	trigger
} from '@angular/animations';
import { DateTime } from 'luxon';
import {
	Observable,
	Subject
} from 'rxjs';
import {
	shareReplay,
	takeUntil
} from 'rxjs/operators';

import IClockFaceTime from './i-clock-face-time';
import ITimepickerTheme from './i-timepicker-theme';
import { TimePeriod } from './time-period';
import TimePickerService from './time-picker.service';
import { TimeUnit } from './time-unit';
import TimePickerEventService from './time-picker-event.service';
import { TimeAdapter } from './time-adapter';
import ITimepickerRef from './i-timepicker-ref';
import ITimepickerConfig from './i-timepicker-config';
import OverlayDirective from './overlay.directive';
import { TIME_LOCALE } from './time-locale';
import TimepickerContentComponent from './timepicker-content.component';
import TimepickerDialComponent from './timepicker-dial.component';
import TimepickerThemeDirective from './timepicker-theme.directive';
import Timepicker24HoursFaceComponent from './timepicker24-hours-face.component';
import Timepicker12HoursFaceComponent from './timepicker12-hours-face.component';
import TimepickerMinutesFaceComponent from './timepicker-minutes-face.component';

export enum AnimationState {
	ENTER = 'enter',
	LEAVE = 'leave'
}

@Component({
	selector: 'wp-time-picker-container',
	standalone: true,
	templateUrl: './time-picker-container.component.html',
	styleUrls: ['./time-picker-container.component.scss'],
	providers: [TimePickerService],
	imports: [
		CommonModule,
		OverlayDirective,
		TimepickerContentComponent,
		TimepickerThemeDirective,
		TimepickerDialComponent,
		Timepicker24HoursFaceComponent,
		Timepicker12HoursFaceComponent,
		TimepickerMinutesFaceComponent
	],
	// animations: [
	// 	trigger('timepicker', [
	// 		transition(`* => ${AnimationState.ENTER}`, [
	// 			style({ transform: 'translateY(-30%)' }),
	// 			animate('0.2s ease-out', style({ transform: 'translateY(0)' }))
	// 		]),
	// 		transition(`${AnimationState.ENTER} => ${AnimationState.LEAVE}`, [
	// 			style({ transform: 'translateY(0)', opacity: 1 }),
	// 			animate('0.2s ease-out', style({ transform: 'translateY(-30%)', opacity: 0 }))
	// 		])
	// 	])
	// ]
})
export default class TimePickerContainerComponent implements OnInit, OnDestroy, ITimepickerConfig {
	selectedHour!: Observable<IClockFaceTime>;
	selectedMinute!: Observable<IClockFaceTime>;
	selectedPeriod!: Observable<TimePeriod>;

	timeUnit = TimeUnit;
	activeTimeUnit = TimeUnit.HOUR;

	animationState!: AnimationState;

	cancelBtnTmpl!: TemplateRef<Node>;
	editableHintTmpl!: TemplateRef<Node>;
	confirmBtnTmpl!: TemplateRef<Node>;
	inputElement: any;

	enableKeyboardInput!: boolean;
	preventOverlayClick!: boolean;
	disableAnimation!: boolean;
	disabled!: boolean;
	appendToInput!: boolean;
	hoursOnly!: boolean;

	format!: number;
	minutesGap!: number;

	minTime!: DateTime;
	maxTime!: DateTime;
	time!: string;

	timepickerClass!: string;
	theme!: ITimepickerTheme;
	timepickerBaseRef!: ITimepickerRef;

	@Input()
	set defaultTime(time: string) {
		this._defaultTime = time;
		this.setDefaultTime(time);
	}

	get defaultTime(): string {
		return this._defaultTime;
	}

	private _defaultTime!: string;
	private unsubscribe = new Subject<void>();

	constructor(
		private readonly _timepickerService: TimePickerService,
		private readonly _eventService: TimePickerEventService,
		@Inject(TIME_LOCALE) private locale: string
	) { }

	@HostListener('keydown', ['$event'])
	onKeydown(e: any): void {
		this._eventService.dispatchEvent(e);
		e.stopPropagation();
	}

	ngOnInit(): void {

		this.animationState = !this.disableAnimation && AnimationState.ENTER as any;

		this.defineTime();

		this.selectedHour = this._timepickerService.selectedHour
			.pipe(shareReplay({ bufferSize: 1, refCount: true }));

		this.selectedMinute = this._timepickerService.selectedMinute
			.pipe(shareReplay({ bufferSize: 1, refCount: true }));

		this.selectedPeriod = this._timepickerService.selectedPeriod
			.pipe(shareReplay({ bufferSize: 1, refCount: true }));

		this.timepickerBaseRef.timeUpdated.pipe(takeUntil(this.unsubscribe))
			.subscribe(this.setDefaultTime.bind(this));
	}

	onHourChange(hour: IClockFaceTime): void {
		this._timepickerService.hour = hour;
		this.onTimeChange();
	}

	onHourSelected(hour: number): void {
		if (!this.hoursOnly) {
			this.changeTimeUnit(TimeUnit.MINUTE);
		}
		this.timepickerBaseRef.hourSelected.next(hour);
	}

	onMinuteChange(minute: IClockFaceTime): void {
		this._timepickerService.minute = minute;
		this.onTimeChange();
	}

	changePeriod(period: TimePeriod): void {
		this._timepickerService.period = period;
		this.onTimeChange();
	}

	changeTimeUnit(unit: TimeUnit): void {
		this.activeTimeUnit = unit;
	}

	setTime(): void {
		this.timepickerBaseRef.timeSet.next(this._timepickerService.getFullTime(this.format));
		this.close();
	}

	close(): void {
		if (this.disableAnimation) {
			this.timepickerBaseRef.close();
			return;
		}

		this.animationState = AnimationState.LEAVE;
	}

	animationDone(event: AnimationEvent): void {
		if (event.phaseName === 'done' && event.toState === AnimationState.LEAVE) {
			this.timepickerBaseRef.close();
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private setDefaultTime(time: string): void {
		this._timepickerService.setDefaultTimeIfAvailable(
			time, this.minTime, this.maxTime, this.format, this.minutesGap);
	}

	private defineTime(): void {
		const minTime = this.minTime;

		if (minTime && (!this.time && !this.defaultTime)) {
			const time = TimeAdapter.fromDateTimeToString(minTime, this.format);

			this.setDefaultTime(time);
		}
	}

	private onTimeChange(): void {
		const time = TimeAdapter.toLocaleTimeString(this._timepickerService.getFullTime(this.format), {
			locale: this.locale,
			format: this.format
		});

		this.timepickerBaseRef.timeChanged.emit(time);
	}
}
