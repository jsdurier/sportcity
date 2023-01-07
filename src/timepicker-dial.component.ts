import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	TemplateRef
} from '@angular/core';
import {
	DateTime,
	Info
} from 'luxon';

import IClockFaceTime from './i-clock-face-time';
import { TIME_LOCALE } from './time-locale';
import { TimePeriod } from './time-period';
import { TimeUnit } from './time-unit';
import TimepickerDialControlComponent from './timepicker-dial-control.component';
import TimepickerPeriodComponent from './timepicker-period.component';
import { TimepickerTimeUtils } from './timepicker-time-utils';

// import { TimePeriod } from '../../models/time-period.enum';
// import { TimeUnit } from '../../models/time-unit.enum';
// import { ClockFaceTime } from '../../models/clock-face-time.interface';
// import { TIME_LOCALE } from '../../tokens/time-locale.token';
// import { TimepickerTimeUtils } from '../../utils/timepicker-time.utils';

@Component({
	selector: 'wp-timepicker-dial',
	standalone: true,
	templateUrl: './timepicker-dial.component.html',
	styleUrls: ['./timepicker-dial.component.scss'],
	imports: [
		TimepickerDialControlComponent,
		CommonModule,
		TimepickerPeriodComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TimepickerDialComponent implements OnChanges {
	@Input() editableHintTmpl!: TemplateRef<Node>;
	@Input() hour!: number | string;
	@Input() minute!: number | string;
	@Input() format!: number;
	@Input() period?: TimePeriod;
	@Input() activeTimeUnit!: TimeUnit;
	@Input() minTime!: DateTime;
	@Input() maxTime!: DateTime;
	@Input() isEditable!: boolean;
	@Input() minutesGap!: number;
	@Input() hoursOnly!: boolean;

	@Output() periodChanged = new EventEmitter<TimePeriod>();
	@Output() timeUnitChanged = new EventEmitter<TimeUnit>();
	@Output() hourChanged = new EventEmitter<IClockFaceTime>();
	@Output() minuteChanged = new EventEmitter<IClockFaceTime>();

	timeUnit = TimeUnit;
	hours!: IClockFaceTime[];
	minutes!: IClockFaceTime[];
	meridiems = Info.meridiems({ locale: this.locale });
	isHintVisible!: boolean;

	constructor(@Inject(TIME_LOCALE) private locale: string) { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes['period'] && changes['period'].currentValue
			|| changes['format'] && changes['format'].currentValue) {
			const hours = TimepickerTimeUtils.getHours(this.format);

			this.hours = TimepickerTimeUtils.disableHours(hours, {
				min: this.minTime,
				max: this.maxTime,
				format: this.format,
				period: this.period
			});
		}
		if (changes['period'] && changes['period'].currentValue
			|| changes['hour'] && changes['hour'].currentValue) {
			const minutes = TimepickerTimeUtils.getMinutes(this.minutesGap);

			this.minutes = TimepickerTimeUtils.disableMinutes(minutes, +(this.hour as any), {
				min: this.minTime,
				max: this.maxTime,
				format: this.format,
				period: this.period
			});
		}
	}

	changeTimeUnit(unit: TimeUnit): void {
		this.timeUnitChanged.next(unit);
	}

	changePeriod(period: TimePeriod): void {
		this.periodChanged.next(period);
	}

	changeHour(hour: IClockFaceTime): void {
		this.hourChanged.next(hour);
	}

	changeMinute(minute: IClockFaceTime): void {
		this.minuteChanged.next(minute);
	}

	showHint(): void {
		this.isHintVisible = true;
	}

	hideHint(): void {
		this.isHintVisible = false;
	}
}
