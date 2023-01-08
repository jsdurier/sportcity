import {
	ChangeDetectorRef,
	Component,
	ComponentRef,
	EmbeddedViewRef,
	Type,
	ViewChild,
	ViewContainerRef,
	ViewRef
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { IAnimation } from './show-page.service';

@Component({
	selector: 'wp-transition-page',
	standalone: true,
	templateUrl: './transition-page.component.html',
	styleUrls: ['./transition-page.component.scss']
})
export default class TransitionPageComponent {
	@ViewChild(
		'container',
		{ read: ViewContainerRef }
	) container!: ViewContainerRef;

	data?: {
		previousViewRef: ViewRef;
		nextViewComponent: Type<unknown>;
		animation: IAnimation;
	};

	private readonly _end$ = new Subject<ComponentRef<unknown>>();
	private _nextComponent?: ComponentRef<unknown>;

	constructor(
		private readonly _cd: ChangeDetectorRef
	) { }

	ngAfterViewInit(): void {
		if (!this.data) {
			throw new Error('no data');
		}
		const previousViewRef = this.data.previousViewRef;
		const animation = this.data.animation;
		if (animation.out !== undefined) {
			const outComponentRef = this.container.createComponent(animation.out);
			outComponentRef.instance.data = previousViewRef;
			outComponentRef.instance.end$.subscribe(e => {
				outComponentRef.destroy();
				/**
				 * TODO
				 * wait end of animation in.
				 */
				this._end$.next(this._nextComponent!);
			});
		} else {
			this.container.move(previousViewRef, 0);
		}
		if (animation.in !== undefined) {
			/**
			 * TODO
			 * animation of next view.
			 */
		} else {
			this._nextComponent = this.container.createComponent(this.data.nextViewComponent);
		}
		this._cd.detectChanges();
	}

	get end$(): Observable<ComponentRef<unknown>> {
		return this._end$.asObservable();
	}
}
