import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import AutofocusDirective from './autofocus.directive';
import IClockFaceTime from './i-clock-face-time';
import TimeLocalizerPipe from './time-localizer.pipe';
import TimeParserPipe from './time-parser.pipe';
import TimeParserService from './time-parser.service';
import { TimeUnit } from './time-unit';

@Component({
	selector: 'wp-timepicker-dial-control',
	standalone: true,
	templateUrl: './timepicker-dial-control.component.html',
	styleUrls: ['./timepicker-dial-control.component.scss'],
	providers: [TimeParserService],
	imports: [
		CommonModule,
		FormsModule,
		AutofocusDirective,
		TimeLocalizerPipe,
		TimeParserPipe
	]
})
export default class TimepickerDialControlComponent {
	@Input() timeList!: IClockFaceTime[];
	@Input() timeUnit!: TimeUnit;
	@Input() time!: string | number;
	@Input() isActive!: boolean;
	@Input() isEditable!: boolean;
	@Input() minutesGap!: number;
	@Input() disabled!: boolean;

	@Output() timeUnitChanged = new EventEmitter<TimeUnit>();
	@Output() timeChanged = new EventEmitter<IClockFaceTime>();
	@Output() focused = new EventEmitter<void>();
	@Output() unfocused = new EventEmitter<void>();

	previousTime!: number | string;

	constructor(private _timeParserService: TimeParserService) { }

	private get selectedTime(): IClockFaceTime {
		if (!!this.time) {
			return this.timeList.find(t => t.time === +this.time) as any;
		}
		return undefined as any;
	}

	saveTimeAndChangeTimeUnit(event: FocusEvent, unit: TimeUnit): void {
		event.preventDefault();
		this.previousTime = this.time;
		this.timeUnitChanged.next(unit);
		this.focused.next();
	}

	updateTime(): void {
		const time = this.selectedTime;
		if (time) {
			this.timeChanged.next(time);
			this.previousTime = time.time;
		}
	}

	changeTimeByKeyboard(e: any): void {
		const char = String.fromCharCode(e.keyCode);

		if (isTimeDisabledToChange(
			this.time,
			char,
			this.timeList
		)) {
			e.preventDefault();
		}
	}

	onKeydown(e: any): void {
		if (!isDigit(e)) {
			e.preventDefault();
		} else {
			this.changeTimeByArrow(e.keyCode);
		}
	}

	onModelChange(value: string): void {
		this.time = this._timeParserService.transform(
			value,
			this.timeUnit
		).toString();
	}

	private changeTimeByArrow(keyCode: number): void {
		const ARROW_UP = 38;
		const ARROW_DOWN = 40;
		let time: string = '';
		if (keyCode === ARROW_UP) {
			time = String(+this.time + (this.minutesGap || 1));
		} else if (keyCode === ARROW_DOWN) {
			time = String(+this.time - (this.minutesGap || 1));
		}
		if (!isTimeUnavailable(time, this.timeList)) {
			this.time = time;
			this.updateTime();
		}
	}

}

function isTimeDisabledToChange(
	currentTime: string | number,
	nextTime: string,
	timeList: IClockFaceTime[]
): boolean {
	const isNumber = /\d/.test(nextTime);
	if (isNumber) {
		const time = currentTime + nextTime;
		return isTimeUnavailable(time, timeList);
	}
	return false;
}

function isTimeUnavailable(
	time: string,
	timeList: IClockFaceTime[]
): boolean {
	const selectedTime = timeList.find(value => value.time === +time);
	return !selectedTime || (selectedTime && selectedTime.disabled) as any;
}

function isDigit(e: KeyboardEvent) {
	// Allow: backspace, delete, tab, escape, enter
	if ([46, 8, 9, 27, 13].some(n => n === e.keyCode) ||
		// Allow: Ctrl/cmd+A
		(e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
		// Allow: Ctrl/cmd+C
		(e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
		// Allow: Ctrl/cmd+X
		(e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
		// Allow: home, end, left, right, up, down
		(e.keyCode >= 35 && e.keyCode <= 40)) {

		return true;
	}
	return !((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105));
}
