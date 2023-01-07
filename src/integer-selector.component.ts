import { CommonModule } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	Input
} from '@angular/core';

import IntegerGraduationComponent from './integer-graduation.component';

const UNIT_SPACE_PX = 50;

@Component({
	selector: 'wp-integer-selector',
	standalone: true,
	templateUrl: './integer-selector.component.html',
	styleUrls: ['./integer-selector.component.scss'],
	imports: [
		CommonModule,
		IntegerGraduationComponent
	]
})
export default class IntegerSelectorComponent {
	/**
	 * TODO
	 * bounds min/max
	 */
	@Input() value!: number;
	@Input() min!: number;
	@Input() max!: number;

	private _width_px!: number;
	private _startClientX?: number;
	private _valueBeforeDrag?: number;

	constructor(
		private readonly _elementRef: ElementRef,
		private readonly _changeDetectorRef: ChangeDetectorRef
	) { }

	ngAfterViewInit(): void {
		const rect = this._elementRef.nativeElement.getBoundingClientRect();
		this._width_px = rect.width;
		this._changeDetectorRef.detectChanges();
	}

	@HostListener(
		'touchmove',
		['$event']
	) private onTouchMove($event: any): void {
		const a = $event.changedTouches[0];
		if (this._startClientX === undefined || this._valueBeforeDrag === undefined) {
			return;
		}
		const gap_px = this._startClientX - a.clientX;
		const gap = gap_px / UNIT_SPACE_PX;
		const newValue = this._valueBeforeDrag + gap;
		if (newValue < this.min || newValue > this.max) {
			return;
		}
		this.value = this._valueBeforeDrag + gap;
		/**
		 * TODO emit change
		 */
	};

	@HostListener(
		'touchstart',
		['$event']
	)
	private onTouchStart($event: any): void {
		const a = $event.changedTouches[0];
		this._startClientX = a.clientX;
		this._valueBeforeDrag = this.value;
	};

	@HostListener(
		'touchend',
		['$event']
	)
	private onTouchEnd($event: any): void {
		this._startClientX = undefined;
		this._valueBeforeDrag = undefined;
	};

	@HostListener(
		'mousemove',
		['$event']
	)
	private onMouseMove($event: any): void {
		// TODO
	}

	get values(): { value: number; position: number }[] {
		if (this._width_px === undefined) {
			return [];
		}
		const res = [];
		let valueBefore = Math.floor(this.value);
		while (true) {
			const gap = this.value - valueBefore;
			const distance_px = gap * UNIT_SPACE_PX;
			if (distance_px > this._width_px / 2) {
				break;
			}
			res.push({
				value: valueBefore,
				position: this._width_px / 2 - distance_px
			});
			valueBefore = valueBefore - 1;
			if (valueBefore < this.min) {
				break;
			}
		}
		let valueAfter = Math.ceil(this.value);
		while (true) {
			const gap = valueAfter - this.value;
			const distance_px = gap * UNIT_SPACE_PX;
			if (distance_px > this._width_px / 2) {
				break;
			}
			res.push({
				value: valueAfter,
				position: this._width_px / 2 + distance_px
			});
			valueAfter = valueAfter + 1;
			if (valueAfter > this.max) {
				break;
			}
		}
		return res;
	}

	trackBy(
		index: number,
		item: any
	): any {
		return item.value;
	}

	isSelected(value: number) {
		const gap = value - this.value;
		return gap <= 0.5 && gap > -0.5;
	}
}
