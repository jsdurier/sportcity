import {
	Pipe,
	PipeTransform
} from '@angular/core';

@Pipe({
	name: 'minutesFormatter',
	standalone: true
})
export default class MinutesFormatterPipe implements PipeTransform {
	transform(minute: number, gap = 5): number | string {
		if (!minute) {
			return minute;
		}
		return minute % gap === 0 ? minute : '';
	}
}
