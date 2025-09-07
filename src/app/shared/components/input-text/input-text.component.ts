import { Component, Inject, input, OnInit, Optional, forwardRef } from '@angular/core';
import {
	AbstractControl,
	ControlContainer,
	FormGroup,
	ReactiveFormsModule,
	ControlValueAccessor,
	NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { FormErrorLabelComponent } from '../form-error-label/form-error-label.component';

@Component({
	selector: 'input-text',
	imports: [ReactiveFormsModule, FormErrorLabelComponent],
	templateUrl: './input-text.component.html',
	styleUrl: './input-text.component.css',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputTextComponent),
			multi: true,
		},
	],
})
export class InputTextComponent implements OnInit, ControlValueAccessor {
	formControlName = input<string>();
	placeholder = input<string>('');

	control!: AbstractControl;
	parentForm!: FormGroup;
	value: any = '';
	disabled = false;

	// Callbacks para ControlValueAccessor
	private onChange = (value: any) => {};
	private onTouched = () => {};

	constructor(
		@Optional() @Inject(ControlContainer) private readonly controlContainer: ControlContainer
	) {}

	ngOnInit() {
		if (this.controlContainer && this.formControlName()) {
			this.parentForm = this.controlContainer.control as FormGroup;
			this.control = this.parentForm.get(this.formControlName()!)!;
			this.control?.markAsTouched();
		}
	}

	// ControlValueAccessor methods
	writeValue(value: any): void {
		this.value = value || '';
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	// Event handlers
	onInputChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		this.value = target.value;
		this.onChange(this.value);

		if (!this.value) {
			this.control?.markAsTouched();
		}
	}

	onBlur(): void {
		this.onTouched();
		this.control?.markAsTouched();
	}

	get hasError(): boolean {
		return !!(this.control?.errors && this.control?.touched);
	}
}
