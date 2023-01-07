import { Component } from '@angular/core';

import TimePickerComponent from './time-picker.component';
import TimepickerDirective from './time-picker.directive';

@Component({
	selector: 'wp-time-picker-example',
	standalone: true,
	templateUrl: './time-picker-example.component.html',
	styleUrls: ['./time-picker-example.component.scss'],
	imports: [
		TimepickerDirective,
		TimePickerComponent
	]
})
export default class TimePickerExampleComponent { }
