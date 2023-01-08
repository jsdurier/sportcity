import {
	ChangeDetectorRef,
	Component,
	NgZone
} from '@angular/core';
import { Unsubscribable } from 'rxjs';

import TrainingSessionService from './training-session.service';

const REFRESH_DELAY_MS = 1000;

@Component({
	selector: 'wp-background',
	standalone: true,
	templateUrl: './background-2.html',
	styleUrls: ['./background-2.scss']
})
export default class BackgroundComponent {
	width_percent = 0;

	private readonly _subscriptions: Unsubscribable[] = [];

	constructor(
		private readonly _trainingSessionService: TrainingSessionService,
		private readonly _ngZone: NgZone,
		private readonly _cd: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this._ngZone.runOutsideAngular(
			() => {
				const ref = setInterval(
					() => {
						this.width_percent = this._trainingSessionService.getTimeEllapsedPercentage() * 100;
						this._cd.detectChanges();
					},
					REFRESH_DELAY_MS
				);
				this._subscriptions.push({
					unsubscribe() {
						clearInterval(ref);
					}
				});
			}
		);
	}

	ngOnDestroy(): void {
		this._subscriptions.forEach(e => e.unsubscribe());
	}
}
