import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import {
	BehaviorSubject,
	Observable
} from 'rxjs';

import IClockFaceTime from './i-clock-face-time';
import { TimeAdapter } from './time-adapter';
import { TimePeriod } from './time-period';

const DEFAULT_HOUR: IClockFaceTime = {
	time: 12,
	angle: 360
};
const DEFAULT_MINUTE: IClockFaceTime = {
	time: 0,
	angle: 360
};

@Injectable({ providedIn: 'root' })
export default class TimePickerService {
	private hourSubject = new BehaviorSubject<IClockFaceTime>(DEFAULT_HOUR);
	private minuteSubject = new BehaviorSubject<IClockFaceTime>(DEFAULT_MINUTE);
	private periodSubject = new BehaviorSubject<TimePeriod>(TimePeriod.AM);

	set hour(hour: IClockFaceTime) {
		this.hourSubject.next(hour);
	}

	get selectedHour(): Observable<IClockFaceTime> {
		return this.hourSubject.asObservable();
	}

	set minute(minute: IClockFaceTime) {
		this.minuteSubject.next(minute);
	}

	get selectedMinute(): Observable<IClockFaceTime> {
		return this.minuteSubject.asObservable();
	}

	set period(period: TimePeriod) {
		const isPeriodValid = (period === TimePeriod.AM) || (period === TimePeriod.PM);

		if (isPeriodValid) {
			this.periodSubject.next(period);
		}
	}

	get selectedPeriod(): Observable<TimePeriod> {
		return this.periodSubject.asObservable();
	}

	setDefaultTimeIfAvailable(time: string, min: DateTime, max: DateTime, format: number, minutesGap?: number) {
		/* Workaround to double error message*/
		try {
			if (TimeAdapter.isTimeAvailable(time, min, max, 'minutes', minutesGap)) {
				this.setDefaultTime(time, format);
			}
		} catch (e) {
			console.error(e);
		}
	}

	getFullTime(format: number): string {
		const selectedHour = this.hourSubject.getValue().time;
		const selectedMinute = this.minuteSubject.getValue().time;
		const hour = selectedHour != null ? selectedHour : DEFAULT_HOUR.time;
		const minute = selectedMinute != null ? selectedMinute : DEFAULT_MINUTE.time;
		const period = format === 12 ? this.periodSubject.getValue() : '';
		const time = `${hour}:${minute} ${period}`.trim();

		return TimeAdapter.formatTime(time, { format });
	}

	private setDefaultTime(time: string, format: number) {
		const defaultTime = TimeAdapter.parseTime(time, { format }).toJSDate();

		if (DateTime.fromJSDate(defaultTime).isValid) {
			const period = time.substr(time.length - 2).toUpperCase();
			const hour = defaultTime.getHours();

			this.hour = { ...DEFAULT_HOUR, time: formatHourByPeriod(hour, period as TimePeriod) };
			this.minute = { ...DEFAULT_MINUTE, time: defaultTime.getMinutes() };
			this.period = period as TimePeriod;

		} else {
			this.resetTime();
		}
	}

	private resetTime(): void {
		this.hour = { ...DEFAULT_HOUR };
		this.minute = { ...DEFAULT_MINUTE };
		this.period = TimePeriod.AM;
	}
}

/***
 *  Format hour in 24hours format to meridian (AM or PM) format
 */
function formatHourByPeriod(hour: number, period: TimePeriod): number {
	switch (period) {
		case TimePeriod.AM:
			return hour === 0 ? 12 : hour;
		case TimePeriod.PM:
			return hour === 12 ? 12 : hour - 12;
		default:
			return hour;
	}
}
