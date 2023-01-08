import {
	Injectable,
	Type
} from '@angular/core';

import AbstractTransitionOutComponent from './abstract-transition-out-component';

type Handler = (
	componentClass: Type<unknown>,
	animation?: IAnimation
) => IData;
interface IData {
	// TODO
}
export interface IAnimation {
	in?: any;
	out?: Type<AbstractTransitionOutComponent>;
}

@Injectable({ providedIn: 'root' })
export default class ShowPageService {
	private _handler?: Handler;
	private _componentClass?: Type<unknown>;
	private _animation?: IAnimation;

	show(
		componentClass: Type<unknown>,
		animation?: IAnimation
	): void {
		this._componentClass = componentClass;
		this._animation = animation;
		if (!this._handler) {
			return;
		}
		this._handler(
			componentClass,
			animation
		);
	}

	registerHandler(
		handler: Handler
	): void {
		this._handler = handler;
		if (this._componentClass !== undefined) {
			this._handler(
				this._componentClass,
				this._animation
			);
		}
	}
}
