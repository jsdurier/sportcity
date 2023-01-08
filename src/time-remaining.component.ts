import {
	ChangeDetectorRef,
	Component,
	NgZone
} from '@angular/core';
import { Unsubscribable } from 'rxjs';

import RelaxTimeService from './relax-time.service';
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
	private readonly _subscriptions: Unsubscribable[] = [];

	constructor(
		private readonly _relaxTimeService: RelaxTimeService,
		private readonly _ngZone: NgZone,
		private readonly _cd: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.value = this.computeValue();
		this._ngZone.runOutsideAngular(() => {
			const intervalRef = setInterval(
				() => {
					const newValue = this.computeValue();
					if (newValue < 0) {
						clearInterval(intervalRef);
					} else {
						this.value = newValue;
						this._cd.detectChanges();
					}
				},
				1000
			);
			this._subscriptions.push({
				unsubscribe() {
					clearInterval(intervalRef);
				}
			});
		});
	}

	ngOnDestroy(): void {
		this._subscriptions.forEach(e => e.unsubscribe());
	}

	private computeValue(): number {
		const now = Date.now();
		const delta_ms = now - this._startTime;
		const newValue = Math.round(this._duration_s - delta_ms / 1000);
		return newValue;
	}

	private get _duration_s(): number {
		return this._relaxTimeService.relaxTime_s;
	}
}
