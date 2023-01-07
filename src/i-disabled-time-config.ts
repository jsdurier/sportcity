import { DateTime } from 'luxon';

import { TimePeriod } from './time-period';

export default interface IDisabledTimeConfig {
	min: DateTime;
	max: DateTime;
	format: number;
	period?: TimePeriod;
}
