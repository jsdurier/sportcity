import ITimepickerDialTheme from './i-timepicker-dial-theme';
import ITimepickerFaceTheme from './i-timepicker-face-theme';
import ITimepickerContainerTheme from './i-timepicker-container-theme';

export default interface ITimepickerTheme {
	container?: ITimepickerContainerTheme;
	dial?: ITimepickerDialTheme;
	clockFace?: ITimepickerFaceTheme;
}
