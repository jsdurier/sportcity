import {
	Pipe,
	PipeTransform
} from '@angular/core';

@Pipe({
	name: 'duration',
	standalone: true
})
export default class DurationPipe implements PipeTransform {
	transform(value_ms: number): string {
		const secondsFull = value_ms / 1000;
		const minutes = Math.floor(secondsFull / 60);
		let res = '';
		if (minutes > 0) {
			res += `${minutes} m `;
		}
		const seconds = Math.floor(secondsFull - minutes * 60);
		res += `${seconds} s`
		return res;
	}
}
