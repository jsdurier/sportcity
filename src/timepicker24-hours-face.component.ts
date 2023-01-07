import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import { DateTime } from 'luxon';

import IClockFaceTime from './i-clock-face-time';
import TimepickerFaceComponent from './timepicker-face.component';
import { TimepickerTimeUtils } from './timepicker-time-utils';

@Component({
	selector: 'wp-timepicker24-hours-face',
	standalone: true,
	templateUrl: './timepicker24-hours-face.component.html',
	styleUrls: ['./timepicker24-hours-face.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TimepickerFaceComponent
	]
})
export default class Timepicker24HoursFaceComponent implements AfterContentInit {
	@Input() selectedHour!: IClockFaceTime;
	@Input() minTime!: DateTime;
	@Input() maxTime!: DateTime;
	@Input() format!: number;

	@Output() hourChange = new EventEmitter<IClockFaceTime>();
	@Output() hourSelected = new EventEmitter<number>();

	hoursList: IClockFaceTime[] = [];

	constructor() {
		this.hoursList = TimepickerTimeUtils.getHours(24);
	}

	onTimeSelected(time: number): void {
		this.hourSelected.next(time);
	}

	ngAfterContentInit() {
		this.hoursList = TimepickerTimeUtils.disableHours(this.hoursList, {
			min: this.minTime,
			max: this.maxTime,
			format: this.format
		});
	}
}
