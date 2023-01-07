import { CommonModule } from '@angular/common';
import {
	Component,
	Input
} from '@angular/core';

import AppendToInputDirective from './append-to-input.directive';

@Component({
	selector: 'wp-timepicker-content',
	standalone: true,
	templateUrl: './timepicker-content.component.html',
	styleUrls: ['./timepicker-content.component.scss'],
	imports: [
		AppendToInputDirective,
		CommonModule
	]
})
export default class TimepickerContentComponent {
	@Input() appendToInput!: boolean;
	@Input() inputElement: any;
}
