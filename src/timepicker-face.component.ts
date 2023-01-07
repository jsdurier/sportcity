import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';

import ActiveHourPipe from './active-hour.pipe';
import ActiveMinutePipe from './active-minute.pipe';
import IClockFaceTime from './i-clock-face-time';
import MinutesFormatterPipe from './minutes-formatter.pipe';
import TimeLocalizerPipe from './time-localizer.pipe';
import { TimeUnit } from './time-unit';

const CLOCK_HAND_STYLES = {
	small: {
			height: '75px',
			top: 'calc(50% - 75px)'
	},
	large: {
			height: '103px',
			top: 'calc(50% - 103px)'
	}
};

@Component({
	selector: 'wp-timepicker-face',
	standalone: true,
	templateUrl: './timepicker-face.component.html',
	styleUrls: ['./timepicker-face.component.scss'],
	imports: [
		CommonModule,
		ActiveHourPipe,
		ActiveMinutePipe,
		MinutesFormatterPipe,
		TimeLocalizerPipe
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TimepickerFaceComponent implements AfterViewInit, OnChanges, OnDestroy {
	@Input() faceTime!: IClockFaceTime[];
	@Input() selectedTime!: IClockFaceTime;
	@Input() unit!: TimeUnit;
	@Input() format!: number;
	@Input() minutesGap!: number;

	@Output() timeChange = new EventEmitter<IClockFaceTime>();
	@Output() timeSelected = new EventEmitter<number>();

	@ViewChild('clockFace', {static: true}) clockFace!: ElementRef;
	@ViewChild('clockHand', {static: true}) clockHand!: ElementRef;

	timeUnit = TimeUnit;
	isClockFaceDisabled!: boolean;
	innerClockFaceSize = 85;

	private isStarted!: boolean;
	private touchStartHandler!: () => any;
	private touchEndHandler!: () => any;

	ngAfterViewInit() {
			this.setClockHandPosition();
			this.addTouchEvents();
	}

	ngOnChanges(changes: SimpleChanges) {
			const faceTimeChanges = changes['faceTime'];
			const selectedTimeChanges = changes['selectedTime'];

			if ((faceTimeChanges && faceTimeChanges.currentValue)
					&& (selectedTimeChanges && selectedTimeChanges.currentValue)) {
					/* Set time according to passed an input value */
					this.selectedTime = this.faceTime.find(time => time.time === this.selectedTime.time) as any;
			}
			if (selectedTimeChanges && selectedTimeChanges.currentValue) {
					this.setClockHandPosition();
			}
			if (faceTimeChanges && faceTimeChanges.currentValue) {
					// To avoid an error ExpressionChangedAfterItHasBeenCheckedError
					setTimeout(() => this.selectAvailableTime());
			}
	}

	trackByTime(_: any, time: IClockFaceTime): string | number {
			return time.time;
	}

	@HostListener('mousedown', ['$event'])
	onMousedown(e: any) {
			e.preventDefault();
			this.isStarted = true;
	}

	@HostListener('click', ['$event'])
	@HostListener('touchmove', ['$event.changedTouches[0]'])
	@HostListener('touchend', ['$event.changedTouches[0]'])
	@HostListener('mousemove', ['$event'])
	selectTime(e: any): void {

			if (!this.isStarted && (e instanceof MouseEvent && e.type !== 'click')) {
					return;
			}
			const clockFaceCords = this.clockFace.nativeElement.getBoundingClientRect();

			/* Get x0 and y0 of the circle */
			const centerX = clockFaceCords.left + clockFaceCords.width / 2;
			const centerY = clockFaceCords.top + clockFaceCords.height / 2;
			/* Counting the arctangent and convert it to from radian to deg */
			const arctangent = Math.atan(Math.abs(e.clientX - centerX) / Math.abs(e.clientY - centerY)) * 180 / Math.PI;
			/* Get angle according to quadrant */
			const circleAngle = countAngleByCords(centerX, centerY, e.clientX, e.clientY, arctangent);
			/* Check if selected time from the inner clock face (24 hours format only) */
			const isInnerClockChosen = this.format && this.isInnerClockFace(centerX, centerY, e.clientX, e.clientY);
			/* Round angle according to angle step */
			const angleStep = this.unit === TimeUnit.MINUTE ? (6 * (this.minutesGap || 1)) : 30;
			const roundedAngle = roundAngle(circleAngle, angleStep);
			const angle = (roundedAngle || 360) + (isInnerClockChosen ? 360 : 0);

			const selectedTime = this.faceTime.find(val => val.angle === angle);

			if (selectedTime && !selectedTime.disabled) {
					this.timeChange.next(selectedTime);

					/* To let know whether user ended interaction with clock face */
					if (!this.isStarted) {
							this.timeSelected.next(selectedTime.time);
					}
			}

	}

	@HostListener('mouseup', ['$event'])
	onMouseup(e: any) {
			e.preventDefault();
			this.isStarted = false;
	}

	ngOnDestroy() {
			this.removeTouchEvents();
	}

	private addTouchEvents(): void {
			this.touchStartHandler = this.onMousedown.bind(this) as any;
			this.touchEndHandler = this.onMouseup.bind(this) as any;

			this.clockFace.nativeElement.addEventListener('touchstart', this.touchStartHandler);
			this.clockFace.nativeElement.addEventListener('touchend', this.touchEndHandler);
	}

	private removeTouchEvents(): void {
			this.clockFace.nativeElement.removeEventListener('touchstart', this.touchStartHandler);
			this.clockFace.nativeElement.removeEventListener('touchend', this.touchEndHandler);
	}

	private setClockHandPosition(): void {
			if (this.format === 24) {
					if (this.selectedTime.time > 12 || this.selectedTime.time === 0) {
							this.decreaseClockHand();
					} else {
							this.increaseClockHand();
					}
			}

			this.clockHand.nativeElement.style.transform = `rotate(${this.selectedTime.angle}deg)`;
	}

	private selectAvailableTime(): void {
			const currentTime = this.faceTime.find(time => this.selectedTime.time === time.time);
			this.isClockFaceDisabled = this.faceTime.every(time => time.disabled);

			if ((currentTime && currentTime.disabled) && !this.isClockFaceDisabled) {
					const availableTime = this.faceTime.find(time => !time.disabled);

					this.timeChange.next(availableTime as any);
			}
	}

	private isInnerClockFace(x0: number, y0: number, x: number, y: number): boolean {
			/* Detect whether time from the inner clock face or not (24 format only) */
			return Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2)) < this.innerClockFaceSize;
	}

	private decreaseClockHand(): void {
			this.clockHand.nativeElement.style.height = CLOCK_HAND_STYLES.small.height;
			this.clockHand.nativeElement.style.top = CLOCK_HAND_STYLES.small.top;
	}

	private increaseClockHand(): void {
			this.clockHand.nativeElement.style.height = CLOCK_HAND_STYLES.large.height;
			this.clockHand.nativeElement.style.top = CLOCK_HAND_STYLES.large.top;
	}
}

function roundAngle(angle: number, step: number): number {
	return Math.round(angle / step) * step;
}

function countAngleByCords(x0: number, y0: number, x: number, y: number, currentAngle: number): number {
	if (y > y0 && x >= x0) {// II quarter
			return 180 - currentAngle;
	} else if (y > y0 && x < x0) {// III quarter
			return 180 + currentAngle;
	} else if (y < y0 && x < x0) {// IV quarter
			return 360 - currentAngle;
	} else {// I quarter
			return currentAngle;
	}
}
