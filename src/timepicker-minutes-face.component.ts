import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from '@angular/core';
import { DateTime } from 'luxon';

import IClockFaceTime from './i-clock-face-time';
import { TimePeriod } from './time-period';
import { TimeUnit } from './time-unit';
import TimepickerFaceComponent from './timepicker-face.component';
import { TimepickerTimeUtils } from './timepicker-time-utils';

@Component({
	selector: 'wp-timepicker-minutes-face',
	standalone: true,
	templateUrl: './timepicker-minutes-face.component.html',
	styleUrls: ['./timepicker-minutes-face.component.scss'],
	imports: [
		TimepickerFaceComponent
	]
})
export default class TimepickerMinutesFaceComponent implements OnChanges {
	minutesList: IClockFaceTime[] = [];
	timeUnit = TimeUnit;

	@Input() selectedMinute!: IClockFaceTime;
	@Input() selectedHour!: number;
	@Input() period!: TimePeriod;
	@Input() minTime!: DateTime;
	@Input() maxTime!: DateTime;
	@Input() format!: number;
	@Input() minutesGap!: number;

	@Output() minuteChange = new EventEmitter<IClockFaceTime>();

	ngOnChanges(changes: SimpleChanges) {
		if (changes['period'] && changes['period'].currentValue) {
			const minutes = TimepickerTimeUtils.getMinutes(this.minutesGap);
			this.minutesList = TimepickerTimeUtils.disableMinutes(minutes, this.selectedHour, {
				min: this.minTime,
				max: this.maxTime,
				format: this.format,
				period: this.period
			});
		}
	}
}
