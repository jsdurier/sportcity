import { Component } from '@angular/core';

import TrainingSessionService from './training-session.service';

@Component({
	selector: 'wp-set-summary',
	standalone: true,
	templateUrl: './set-summary.component.html',
	styleUrls: ['./set-summary.component.scss']
})
export default class SetSummaryComponent {
	constructor(
		private readonly _trainingSessionService: TrainingSessionService
	) { }

	get setCount(): number {
		return this._trainingSessionService.getCurrentExerciseSetCount();		
	}

	get serieText(): string {
		if (this.setCount === 1) {
			return 'série';
		}
		return 'séries';
	}
}
