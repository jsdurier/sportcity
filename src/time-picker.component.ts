import {
	Component,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from '@angular/core';
import { DateTime } from 'luxon';
import {
	merge,
	Subject
} from 'rxjs';
import {
	filter,
	takeUntil
} from 'rxjs/operators';

import DomService from './dom.service';
import ITimepickerTheme from './i-timepicker-theme';
import ITimepickerRef from './i-timepicker-ref';
import TimepickerDirective from './time-picker.directive';
import TimePickerEventService from './time-picker-event.service';
import TimePickerContainerComponent from './time-picker-container.component';

const ESCAPE = 27;

@Component({
	selector: 'wp-time-picker',
	standalone: true,
	templateUrl: './time-picker.component.html',
	styleUrls: ['./time-picker.component.scss']
})
export default class TimePickerComponent implements ITimepickerRef {
	@Input() cancelBtnTmpl!: TemplateRef<Node>;
	@Input() editableHintTmpl!: TemplateRef<Node>;
	@Input() confirmBtnTmpl!: TemplateRef<Node>;
	@Input('ESC') isEsc = true;
	@Input() enableKeyboardInput!: boolean;
	@Input() preventOverlayClick!: boolean;
	@Input() disableAnimation!: boolean;
	@Input() appendToInput!: boolean;
	@Input() hoursOnly = false;
	@Input() defaultTime!: string;
	@Input() timepickerClass!: string;
	@Input() theme!: ITimepickerTheme;
	@Input() min!: DateTime;
	@Input() max!: DateTime;
	/**
	 * @deprecated Since version 5.1.1. Will be deleted on version 6.0.0. Use @Input() theme instead
	 */
	@Input()
	set ngxMaterialTimepickerTheme(theme: ITimepickerTheme) {
		console.warn(`'ngxMaterialTimepickerTheme' is deprecated. Use 'theme' instead`);
		this._ngxMaterialTimepickerTheme = theme;
	}

	@Input()
	set format(value: number) {
		this._format = value === 24 ? 24 : 12;
	}

	get format(): number {
		return this.timepickerInput ? this.timepickerInput.format : this._format;
	}

	@Input()
	set minutesGap(gap: number) {
		if (gap == null) {
			return;
		}
		gap = Math.floor(gap);
		this._minutesGap = gap <= 59 ? gap : 1;
	}

	get minutesGap(): number {
		return this._minutesGap;
	}

	@Output() timeSet = new EventEmitter<string>();
	@Output() opened = new EventEmitter<void>();
	@Output() closed = new EventEmitter<void>();
	@Output() hourSelected = new EventEmitter<number>();
	@Output() timeChanged = new EventEmitter<string>();

	timeUpdated = new Subject<string>();

	private _minutesGap!: number;
	private _format!: number;
	private _ngxMaterialTimepickerTheme!: ITimepickerTheme;
	private timepickerInput!: TimepickerDirective;
	private unsubscribe = new Subject<void>();

	constructor(
		private readonly _eventService: TimePickerEventService,
		private readonly _domService: DomService
	) { }

	get minTime(): DateTime {
		return this.timepickerInput ? (this.timepickerInput.min as DateTime) : this.min;
	}

	get maxTime(): DateTime {
		return this.timepickerInput ? (this.timepickerInput.max as DateTime) : this.max;
	}

	get disabled(): boolean {
		return this.timepickerInput && this.timepickerInput.disabled;
	}

	get time(): string {
		return this.timepickerInput && this.timepickerInput.value;
	}

	get inputElement(): any {
		return this.timepickerInput && this.timepickerInput.element;
	}

	/***
	 * Register an input with this timepicker.
	 * input - The timepicker input to register with this timepicker
	 */
	registerInput(input: TimepickerDirective): void {
		if (this.timepickerInput) {
			throw Error('A Timepicker can only be associated with a single input.');
		}
		this.timepickerInput = input;
	}

	open(): void {
		console.log('open timepicker');
		this._domService.appendTimepickerToBody(TimePickerContainerComponent, {
			timepickerBaseRef: this,
			time: this.time,
			defaultTime: this.defaultTime,
			maxTime: this.maxTime,
			minTime: this.minTime,
			format: this.format,
			minutesGap: this.minutesGap,
			disableAnimation: this.disableAnimation,
			cancelBtnTmpl: this.cancelBtnTmpl,
			confirmBtnTmpl: this.confirmBtnTmpl,
			editableHintTmpl: this.editableHintTmpl,
			disabled: this.disabled,
			enableKeyboardInput: this.enableKeyboardInput,
			preventOverlayClick: this.preventOverlayClick,
			appendToInput: this.appendToInput,
			hoursOnly: this.hoursOnly,
			theme: this.theme || this._ngxMaterialTimepickerTheme,
			timepickerClass: this.timepickerClass,
			inputElement: this.inputElement
		});
		this.opened.next();
		this.subscribeToEvents();
	}

	close(): void {
		this._domService.destroyTimepicker();
		this.closed.next();
		this.unsubscribeFromEvents();
	}

	updateTime(time: string): void {
		this.timeUpdated.next(time);
	}

	private subscribeToEvents(): void {
		merge(this._eventService.backdropClick,
			this._eventService.keydownEvent.pipe(filter(e => e.keyCode === ESCAPE && this.isEsc)))
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(() => this.close());
	}

	private unsubscribeFromEvents(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
