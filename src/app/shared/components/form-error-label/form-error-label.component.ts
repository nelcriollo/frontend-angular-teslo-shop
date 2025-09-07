import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtil } from 'src/app/utils/form-util';

@Component({
	selector: 'form-error-label',
	imports: [],
	templateUrl: './form-error-label.component.html',
	styleUrl: './form-error-label.component.css',
})
export class FormErrorLabelComponent {
	control = input.required<AbstractControl>();

	get errorMessage(): string | null {
		const errors: ValidationErrors = this.control()?.errors || {};

		return this.control()?.touched && Object.keys(errors).length > 0
			? FormUtil.getMessageError(errors)
			: null;
	}
}
