import { CommonModule } from '@angular/common';
import {
	Component,
	ContentChildren,
	QueryList
} from '@angular/core';

import TemplateMarker from './template-marker.directive';

@Component({
	selector: 'wp-layers',
	standalone: true,
	templateUrl: './layers.component.html',
	styleUrls: ['./layers.component.scss'],
	imports: [
		CommonModule
	]
})
export default class LayersComponent {
	@ContentChildren(TemplateMarker) layers!: QueryList<any>;
}
