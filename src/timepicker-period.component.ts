import {
	animate,
	sequence,
	style,
	transition,
	trigger
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import { DateTime } from 'luxon';

import IClockFaceTime from './i-clock-face-time';
import { TimePeriod } from './time-period';
import { TimeUnit } from './time-unit';
import { TimepickerTimeUtils } from './timepicker-time-utils';

@Component({
	selector: 'wp-timepicker-period',
	standalone: true,
	templateUrl: './timepicker-period.component.html',
	styleUrls: ['./timepicker-period.component.scss'],
	animations: [
		trigger('scaleInOut', [
			transition(':enter', [
				style({ transform: 'scale(0)' }),
				animate('.2s', style({ transform: 'scale(1)' })),
				sequence([
					animate('3s', style({ opacity: 1 })),
					animate('.3s', style({ opacity: 0 }))
				])
			])
		])
	],
	imports: [
		CommonModule
	]
})
export default class TimepickerPeriodComponent {
	@Input() selectedPeriod?: TimePeriod;
	@Input() format!: number;
	@Input() activeTimeUnit!: TimeUnit;
	@Input() hours!: IClockFaceTime[];
	@Input() minutes!: IClockFaceTime[];
	@Input() minTime!: DateTime;
	@Input() maxTime!: DateTime;
	@Input() selectedHour!: number | string;
	@Input() meridiems!: string[];

	@Output() periodChanged = new EventEmitter<TimePeriod>();

	timePeriod = TimePeriod;
	isPeriodAvailable = true;

	changePeriod(period: TimePeriod): void {
		this.isPeriodAvailable = this.isSwitchPeriodAvailable(period);
		if (this.isPeriodAvailable) {
			this.periodChanged.next(period);
		}
	}

	animationDone(): void {
		this.isPeriodAvailable = true;
	}

	private isSwitchPeriodAvailable(period: TimePeriod): boolean {
		const time = this.getDisabledTimeByPeriod(period);
		return !time.every(t => t.disabled);
	}

	private getDisabledTimeByPeriod(period: TimePeriod): IClockFaceTime[] {
		switch (this.activeTimeUnit) {
			case TimeUnit.HOUR:
				return TimepickerTimeUtils.disableHours(this.hours, {
					min: this.minTime,
					max: this.maxTime,
					format: this.format,
					period
				});
			case TimeUnit.MINUTE:
				return TimepickerTimeUtils.disableMinutes(this.minutes, +this.selectedHour, {
					min: this.minTime,
					max: this.maxTime,
					format: this.format,
					period
				});
			default:
				throw new Error('no such TimeUnit');
		}
	}
}
