import { TemplateRef } from '@angular/core';
import { DateTime } from 'luxon';

import ITimepickerRef from './i-timepicker-ref';
import ITimepickerTheme from './i-timepicker-theme';

export default interface ITimepickerConfig {
	cancelBtnTmpl: TemplateRef<Node>;
	editableHintTmpl: TemplateRef<Node>;
	confirmBtnTmpl: TemplateRef<Node>;
	inputElement: any;
	enableKeyboardInput: boolean;
	preventOverlayClick: boolean;
	disableAnimation: boolean;
	disabled: boolean;
	appendToInput: boolean;
	hoursOnly: boolean;
	format: number;
	minutesGap: number;
	minTime: DateTime;
	maxTime: DateTime;
	defaultTime: string;
	time: string;
	timepickerClass: string;
	theme: ITimepickerTheme;
	timepickerBaseRef: ITimepickerRef;
}
