import { Component } from '@angular/core';

import RelaxSpinnerComponent from './relax-spinner.component';
import TimeRemainingComponent from './time-remaining.component';

@Component({
	selector: 'wp-relax',
	standalone: true,
	templateUrl: './relax.component.html',
	styleUrls: ['./relax.component.scss'],
	imports: [
		RelaxSpinnerComponent,
		TimeRemainingComponent
	]
})
export default class RelaxComponent { }
