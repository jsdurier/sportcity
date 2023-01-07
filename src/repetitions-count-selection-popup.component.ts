import { Component } from '@angular/core';

import ContainerWithPaddingComponent from './container-with-padding.component';
import ContinueButtonComponent from './continue-button.component';
import IntegerSelectorComponent from './integer-selector.component';
import SubtitleComponent from './subtitle.component';
import TitleComponent from './title.component';

@Component({
	selector: 'wp-repetions-count-selection-popup',
	standalone: true,
	templateUrl: './repetitions-count-selection-popup.component.html',
	styleUrls: ['./repetitions-count-selection-popup.component.scss'],
	imports: [
		ContainerWithPaddingComponent,
		ContinueButtonComponent,
		IntegerSelectorComponent,
		SubtitleComponent,
		TitleComponent
	]
})
export default class RepetitionsCountSelectionPopupComponent { }
