import {
	Directive,
	HostListener,
	Input
} from '@angular/core';

import TimePickerEventService from './time-picker-event.service';

@Directive({
	selector: '[overlay]',
	standalone: true
})
export default class OverlayDirective {
	@Input('overlay') preventClick!: boolean;

	constructor(private readonly _eventService: TimePickerEventService) { }

	@HostListener('click', ['$event'])
	onClick(e: any) {
		if (!this.preventClick) {
			this._eventService.dispatchEvent(e);
		}
		e.preventDefault();
	}
}
