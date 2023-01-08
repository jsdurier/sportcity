import {
	Component,
	ViewChild,
	ViewContainerRef
} from '@angular/core';

import AbstractTransitionOutComponent from './abstract-transition-out-component';

const ANIMATION_DURATION_MS = 1000;

@Component({
	selector: 'wp-fade-out-transition',
	standalone: true,
	templateUrl: './fade-out-transition.component.html',
	styleUrls: ['./fade-out-transition.component.scss']
})
export default class FadeOutTransitionComponent extends AbstractTransitionOutComponent {
	@ViewChild(
		'container',
		{ read: ViewContainerRef }
	) container!: ViewContainerRef;

	constructor() {
		super(ANIMATION_DURATION_MS);
	}

	ngAfterViewInit(): void {
		super.onAfterViewInit();
	}
}
