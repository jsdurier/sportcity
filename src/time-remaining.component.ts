import { Component } from '@angular/core';

import SubtitleComponent from './subtitle.component';

@Component({
	selector: 'wp-time-remaining',
	standalone: true,
	templateUrl: './time-remaining.component.html',
	styleUrls: ['./time-remaining.component.scss'],
	imports: [
		SubtitleComponent
	]
})
export default class TimeRemainingComponent {
	value!: number;

	private _startTime: number = Date.now(); // TODO
	private _duration_s = 10; // TODO

	ngOnInit(): void {
		this.value = this.computeValue();
		const intervalRef = setInterval(
			() => {
				const newValue = this.computeValue();
				if (newValue < 0) {
					clearInterval(intervalRef);
				} else {
					this.value = newValue;
				}
			},
			1000
		);
	}

	private computeValue(): number {
		const now = Date.now();
		const delta_ms = now - this._startTime;
		const newValue = Math.round(this._duration_s - delta_ms / 1000);
		return newValue;
	}
}
