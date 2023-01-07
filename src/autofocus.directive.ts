import {
	Directive,
	ElementRef,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Optional
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
	selector: '[timepickerAutofocus]',
	standalone: true
})
export default class AutofocusDirective implements OnChanges, OnDestroy {

	@Input('timepickerAutofocus') isFocusActive!: boolean;

	private activeElement: HTMLElement;

	constructor(
		private element: ElementRef,
		@Optional() @Inject(DOCUMENT) private document: any
	) {
		this.activeElement = this.document.activeElement;
	}

	ngOnChanges() {
		if (this.isFocusActive) {
			// To avoid ExpressionChangedAfterItHasBeenCheckedError;
			setTimeout(() => this.element.nativeElement.focus({ preventScroll: true }));
		}
	}

	ngOnDestroy() {
		// To avoid ExpressionChangedAfterItHasBeenCheckedError;
		setTimeout(() => this.activeElement.focus({ preventScroll: true }));
	}
}
