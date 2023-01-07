import {
	Component,
	Input
} from '@angular/core';

@Component({
	selector: 'wp-integer-graduation',
	standalone: true,
	templateUrl: './integer-graduation.component.html',
	styleUrls: ['./integer-graduation.component.scss']
})
export default class IntegerGraduationComponent {
	@Input() value!: number;
	@Input() isSelected = false;
}
