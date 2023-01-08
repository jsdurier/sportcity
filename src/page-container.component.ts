import { CommonModule } from '@angular/common';
import {
	Component,
	ContentChild,
	ViewContainerRef,
	ViewRef
} from '@angular/core';

import ShowPageService from './show-page.service';
import TemplateMarker from './template-marker.directive';
import TransitionPageComponent from './transition-page.component';

@Component({
	selector: 'wp-page-container',
	standalone: true,
	templateUrl: './page-container.component.html',
	styleUrls: ['./page-container.component.scss'],
	imports: [
		CommonModule,
		TransitionPageComponent
	]
})
export default class PageContainerComponent {
	@ContentChild(TemplateMarker) firstPage?: TemplateMarker;

	private _embeddedViewRef?: ViewRef;

	constructor(
		private readonly _showPageService: ShowPageService,
		private readonly _viewContainerRef: ViewContainerRef
	) { }

	ngAfterContentInit(): void {
		console.log('PageContainerComponent.ngAfterContentInit');
		if (this.firstPage === undefined) {
			return;
		}
		const template = this.firstPage.template;
		this._embeddedViewRef = this._viewContainerRef.createEmbeddedView(template);
	}

	ngOnInit(): void {
		this._showPageService.registerHandler(
			(
				componentClass,
				animation
			) => {
				if (animation === undefined) {
					this._embeddedViewRef?.destroy();
					const componentRef = this._viewContainerRef.createComponent(componentClass);
					this._embeddedViewRef = componentRef.hostView;
					return {};
				}
				const transitionPageComponentRef = this._viewContainerRef.createComponent(TransitionPageComponent);
				transitionPageComponentRef.instance.data = {
					previousViewRef: this._embeddedViewRef!,
					nextViewComponent: componentClass,
					animation
				};
				transitionPageComponentRef.instance.end$.subscribe(e => {
					this._viewContainerRef.move(
						e.hostView,
						0
					);
					transitionPageComponentRef.destroy();
					this._embeddedViewRef = e.hostView;
				});
				return {};
			});
	}
}
