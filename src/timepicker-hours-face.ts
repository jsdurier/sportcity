import {
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import { DateTime } from 'luxon';

import IClockFaceTime from './i-clock-face-time';
import { TimepickerTimeUtils } from './timepicker-time-utils';

export abstract class NgxMaterialTimepickerHoursFace {
	@Input() selectedHour!: IClockFaceTime;
	@Input() minTime!: DateTime;
	@Input() maxTime!: DateTime;
	@Input() format!: number;

	@Output() hourChange = new EventEmitter<IClockFaceTime>();
	@Output() hourSelected = new EventEmitter<number>();

	hoursList: IClockFaceTime[] = [];

	protected constructor(format: number) {
		this.hoursList = TimepickerTimeUtils.getHours(format);
	}

	onTimeSelected(time: number): void {
		this.hourSelected.next(time);
	}
}
