import { Injectable } from '@angular/core';

const DEFAULT_SESSION_DURATION_M = 60;

@Injectable({ providedIn: 'root' })
export default class SessionDurationConfigService {
	sessionDuration_m = DEFAULT_SESSION_DURATION_M;
}
