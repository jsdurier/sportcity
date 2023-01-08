import {
	ComponentRef,
	Injectable,
	Type
} from '@angular/core';
import { Observable } from 'rxjs';

type Handler = (componentClass: Type<unknown>) => {
	componentRef: ComponentRef<unknown>;
	close$: Observable<void>;
	close(): void;
};

@Injectable({ providedIn: 'root' })
export default class PopupService {
	private _handler?: Handler;

	open<T>(componentClass: Type<T>): IPopupRef<T> {
		if (this._handler === undefined) {
			throw new Error('no handler defined');
		}
		const data = this._handler(componentClass);
		return {
			componentRef: data.componentRef as ComponentRef<T>,
			close$: data.close$,
			close: data.close
		};
	}

	registerHandler(handler: Handler): void {
		this._handler = handler;
	}
}

interface IPopupRef<T> {
	componentRef: ComponentRef<T>;
	close$: Observable<void>;
	close(): void;
}
