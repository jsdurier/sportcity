import { CommonModule } from '@angular/common';
import {
	Component,
	ElementRef,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';

import PopupService from './popup.service';

@Component({
	selector: 'wp-popup-container',
	standalone: true,
	templateUrl: './popup-container.component.html',
	styleUrls: ['./popup-container.component.scss'],
	imports: [
		CommonModule
	]
})
export default class PopupContainerComponent {
	@ViewChild(
		'container',
		{ read: ViewContainerRef }
	) container!: ViewContainerRef;
	@ViewChild('content') content!: ElementRef;

	isOpen = false;

	private readonly _close$ = new Subject<void>();

	constructor(
		private readonly _popupService: PopupService
	) { }

	ngAfterViewInit(): void {
		this._popupService.registerHandler(componentClass => {
			this.isOpen = true;
			const componentRef = this.container.createComponent(componentClass);
			return {
				componentRef,
				close$: this._close$,
				close: () => this.close()
			};
		});
	}

	onOverlayClick(event: any): void {
		const clickTargetHtml = event.target as HTMLElement;
		if (this.content.nativeElement.contains(clickTargetHtml)) {
			return;
		}
		this.close();
	}

	private close(): void {
		this.container.clear();
		this.isOpen = false;
		this._close$.next();
	}
}
