import { Injectable } from '@angular/core';

import { take, timer } from 'rxjs';

/**
 * TODO use this service to inform
 * the user it is a pwa.
 */
@Injectable({ providedIn: 'root' })
export default class PwaService {
	// private _promptEvent: any;

	constructor(
		// private readonly _platform: Platform
	) { }

	public initPwaPrompt() {
		// if (this._platform.ANDROID) {
		// 	window.addEventListener(
		// 		'beforeinstallprompt',
		// 		(event: any) => {
		// 			event.preventDefault();
		// 			// this._promptEvent = event;
		// 			this.openPromptComponent(
		// 				'android',
		// 				event
		// 			);
		// 		}
		// 	);
		// }
		// if (this._platform.IOS) {
		// 	const isInStandaloneMode = ('standalone' in window.navigator) && ((window.navigator as any)['standalone']);
		// 	if (!isInStandaloneMode) {
		// 		this.openPromptComponent('ios');
		// 	}
		// }
	}

	private openPromptComponent(
		mobileType: 'ios' | 'android',
		promptEvent?: any
	): void {
		// timer(3000)
		// 	.pipe(take(1))
		// 	.subscribe(() => this._bottomSheet.open(
		// 		PromptComponent,
		// 		{
		// 			data: {
		// 				mobileType,
		// 				promptEvent: promptEvent
		// 			}
		// 		}
		// 	));
	}
}
