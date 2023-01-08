import {
	Component,
	ContentChild
} from '@angular/core';

import BackgroundComponent from './background-2';
import ExercisesLeftComponent from './exercises-left.component';
import FinishWorkoutButtonComponent from './finish-workout-button.component';
import LayersComponent from './layers.component';
import PageContainerComponent from './page-container.component';
import TemplateMarker from './template-marker.directive';

@Component({
	selector: 'wp-session-container',
	standalone: true,
	templateUrl: './session-container.component.html',
	styleUrls: ['./session-container.component.scss'],
	imports: [
		BackgroundComponent,
		ExercisesLeftComponent,
		FinishWorkoutButtonComponent,
		LayersComponent,
		PageContainerComponent,
		TemplateMarker
	]
})
export default class SessionContainerComponent {
	@ContentChild(TemplateMarker) templateMarker!: TemplateMarker;
}
