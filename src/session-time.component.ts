import {
	ChangeDetectorRef,
	Component,
	NgZone
} from '@angular/core';
import { Unsubscribable } from 'rxjs';

import DurationPipe from './duration.pipe';

import TrainingSessionService from './training-session.service';

@Component({
	selector: 'wp-session-time',
	standalone: true,
	templateUrl: './session-time.component.html',
	styleUrls: ['./session-time.component.scss'],
	imports: [
		DurationPipe
	]
})
export default class SessionTimeComponent {
	time_ms!: number;

	private readonly _subscriptions: Unsubscribable[] = [];

	constructor(
		private readonly _trainingSessionService: TrainingSessionService,
		private readonly _ngZone: NgZone,
		private readonly _cd: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.time_ms = this._trainingSessionService.getTimeEllapsed_ms();
		this._ngZone.runOutsideAngular(() => {
			const ref = setInterval(
				() => {
					this.time_ms = this._trainingSessionService.getTimeEllapsed_ms();
					this._cd.detectChanges();
				},
				1000
			);
			this._subscriptions.push({
				unsubscribe() {
					clearInterval(ref);
				}
			});
		});
	}

	ngOnDestroy(): void {
		this._subscriptions.forEach(e => e.unsubscribe());
	}
}
