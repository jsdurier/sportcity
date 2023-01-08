import {
	EmbeddedViewRef,
	ViewContainerRef,
	ViewRef
} from '@angular/core';
import {
	Observable,
	Subject
} from 'rxjs';

export default abstract class AbstractTransitionOutComponent {
	data?: ViewRef;
	abstract container: ViewContainerRef;

	private readonly _end$ = new Subject<void>();

	constructor(private readonly _animationDuration_ms: number) { }

	get end$(): Observable<void> {
		return this._end$.asObservable();
	}

	protected onAfterViewInit(): void {
		if (this.data === undefined) {
			throw new Error('no data');
		}
		this.container.move(this.data, 0);
		setTimeout(
			() => {
				this._end$.next();
			},
			this._animationDuration_ms
		);
	}
}
