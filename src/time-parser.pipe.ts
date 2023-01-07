import {
	Inject,
	Injectable,
	Pipe,
	PipeTransform
} from '@angular/core';
import { DateTime } from 'luxon';

import { TIME_LOCALE } from './time-locale';
import { TimeUnit } from './time-unit';

type TimeMeasure = 'hour' | 'minute';

@Pipe({
	name: 'timeParser',
	standalone: true
})
@Injectable()
export default class TimeParserPipe implements PipeTransform {
	private readonly _numberingSystem: string;

	constructor(@Inject(TIME_LOCALE) private locale: string) {
		this._numberingSystem = DateTime.local().setLocale(this.locale).resolvedLocaleOpts().numberingSystem;
	}

	transform(
		time: string | number,
		timeUnit = TimeUnit.HOUR
	): number | string {
		if (time == null || time === '') {
			return '';
		}
		if (!isNaN(+time)) {
			return time;
		}
		if (timeUnit === TimeUnit.MINUTE) {
			return this.parseTime(time, 'm', 'minute');
		}
		return this.parseTime(time, 'H', 'hour');
	}

	private parseTime(
		time: string | number,
		format: string,
		timeMeasure: TimeMeasure
	): number {
		const parsedTime = DateTime.fromFormat(
			String(time),
			format,
			{ numberingSystem: this._numberingSystem }
		)[timeMeasure];
		if (!isNaN(parsedTime)) {
			return parsedTime;
		}
		throw new Error(`Cannot parse time - ${time}`);
	}
}
