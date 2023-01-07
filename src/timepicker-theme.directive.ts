import {
	AfterViewInit,
	Directive,
	ElementRef,
	Input
} from '@angular/core';

import ITimepickerTheme from './i-timepicker-theme';

@Directive({
	selector: '[wpTimepickerTheme]',
	standalone: true
})
export default class TimepickerThemeDirective implements AfterViewInit {
	@Input('wpTimepickerTheme') theme!: ITimepickerTheme;

	private element: HTMLElement;

	constructor(elementRef: ElementRef) {
		this.element = elementRef.nativeElement;
	}

	ngAfterViewInit() {
		if (this.theme) {
			this.setTheme(this.theme);
		}
	}

	private setTheme(theme: any): void {
		for (const val in theme) {
			if (theme.hasOwnProperty(val)) {
				if (typeof theme[val] === 'string') {
					for (const prop in theme) {
						if (theme.hasOwnProperty(prop)) {
							this.element.style.setProperty(`--${camelCaseToDash(prop)}`, theme[prop]);
						}
					}
					return;
				}
				this.setTheme(theme[val]);
			}

		}
	}
}

function camelCaseToDash(myStr: string): string {
	return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
