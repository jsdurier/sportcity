import { Injectable } from '@angular/core';

const DEFAULT_RELAX_TIME_S = 90;

@Injectable({ providedIn: 'root' })
export default class RelaxTimeService { 
	relaxTime_s = DEFAULT_RELAX_TIME_S;
}
