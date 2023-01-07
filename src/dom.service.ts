import {
	ApplicationRef,
	ComponentFactoryResolver,
	ComponentRef,
	EmbeddedViewRef,
	Inject,
	Injectable,
	Injector,
	Optional,
	Type
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import ITimepickerConfig from './i-timepicker-config';
import TimePickerContainerComponent from './time-picker-container.component';

@Injectable({ providedIn: 'root' })
export default class DomService {
	private componentRef!: ComponentRef<TimePickerContainerComponent>;

	constructor(
		private cfr: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector,
		@Optional() @Inject(DOCUMENT) private document: any
	) { }

	appendTimepickerToBody(
		timepicker: Type<TimePickerContainerComponent>,
		config: ITimepickerConfig
	): void {
		this.componentRef = this.cfr.resolveComponentFactory(timepicker).create(this.injector);
		Object.keys(config).forEach(key => (this.componentRef.instance as any)[key] = (config as any)[key]);
		this.appRef.attachView(this.componentRef.hostView);
		const domElement: HTMLElement = (this.componentRef.hostView as EmbeddedViewRef<TimePickerContainerComponent>)
			.rootNodes[0];
		this.document.body.appendChild(domElement);
	}

	destroyTimepicker(): void {
		this.componentRef.destroy();
		this.appRef.detachView(this.componentRef.hostView);
	}
}
