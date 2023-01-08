import { Component } from '@angular/core';

import RelaxComponent from './relax.component';
import SessionContainerComponent from './session-container.component';

@Component({
	selector: 'wp-relax-debug-page',
	standalone: true,
	templateUrl: './relax-debug-page.component.html',
	styleUrls: ['./relax-debug-page.component.scss'],
	imports: [
		RelaxComponent,
		SessionContainerComponent
	]
})
export default class RelaxDebugPageComponent { }
