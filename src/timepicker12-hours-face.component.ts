import {
	Component,
	EventEmitter,
	Input,
	Output,
	SimpleChanges
} from '@angular/core';
import { DateTime } from 'luxon';

import IClockFaceTime from './i-clock-face-time';
import { TimePeriod } from './time-period';
import TimepickerFaceComponent from './timepicker-face.component';
import { TimepickerTimeUtils } from './timepicker-time-utils';

@Component({
	selector: 'wp-timepicker12-hours-face',
	standalone: true,
	templateUrl: './timepicker12-hours-face.component.html',
	styleUrls: ['./timepicker12-hours-face.component.scss'],
	imports: [
		TimepickerFaceComponent
	]
})
export default class Timepicker12HoursFaceComponent {
	@Input() selectedHour!: IClockFaceTime;
	@Input() minTime!: DateTime;
	@Input() maxTime!: DateTime;
	@Input() format!: number;
	@Input() period!: TimePeriod;

	@Output() hourChange = new EventEmitter<IClockFaceTime>();
	@Output() hourSelected = new EventEmitter<number>();

	hoursList: IClockFaceTime[] = [];

	constructor() {
		this.hoursList = TimepickerTimeUtils.getHours(12);
	}

	onTimeSelected(time: number): void {
		this.hourSelected.next(time);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['period'] && changes['period'].currentValue) {
			this.hoursList = TimepickerTimeUtils.disableHours(this.hoursList, {
				min: this.minTime,
				max: this.maxTime,
				format: this.format,
				period: this.period
			});
		}
	}
}
