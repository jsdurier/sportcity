import { Injectable } from '@angular/core';
import {
	Observable,
	Subject
} from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export default class TimePickerEventService {
	private backdropClickSubject = new Subject<MouseEvent>();
	private keydownEventSubject = new Subject<KeyboardEvent>();

	get backdropClick(): Observable<MouseEvent> {
		return this.backdropClickSubject.asObservable().pipe(shareReplay({ bufferSize: 1, refCount: true }));
	}

	get keydownEvent(): Observable<KeyboardEvent> {
		return this.keydownEventSubject.asObservable().pipe(shareReplay({ bufferSize: 1, refCount: true }));
	}

	dispatchEvent(event: KeyboardEvent | MouseEvent): void {
		switch (event.type) {
			case 'click':
				this.backdropClickSubject.next(<MouseEvent>event);
				break;
			case 'keydown':
				this.keydownEventSubject.next(<KeyboardEvent>event);
				break;
			default:
				throw new Error('no such event type');
		}
	}
}
