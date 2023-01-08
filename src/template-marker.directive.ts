import {
	Directive,
	TemplateRef
} from '@angular/core';

@Directive({
	selector: '[wpTemplateMarker]',
	standalone: true
})
export default class TemplateMarker {
	constructor(public template: TemplateRef<any>) { }
}
