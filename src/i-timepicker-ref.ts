import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export default interface ITimepickerRef {
    timeSet: EventEmitter<string>;
    hourSelected: EventEmitter<number>;
    timeUpdated: Observable<string>;
    timeChanged: EventEmitter<string>;
    close(): void;
}
