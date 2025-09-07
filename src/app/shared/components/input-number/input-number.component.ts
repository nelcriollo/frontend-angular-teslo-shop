import { Component, forwardRef, Inject, input, OnInit, Optional } from '@angular/core';
import { FormErrorLabelComponent } from '../form-error-label/form-error-label.component';
import {
	AbstractControl,
	ControlContainer,
	ControlValueAccessor,
	FormGroup,
	NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
	selector: 'input-number',
	imports: [FormErrorLabelComponent],
	templateUrl: './input-number.component.html',
	styleUrl: './input-number.component.css',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputNumberComponent),
			multi: true,
		},
	],
})
export class InputNumberComponent implements OnInit, ControlValueAccessor {
	formControlName = input<string>();
	placeholder = input<string>('');
	min = input<number>();
	max = input<number>();
	step = input<number>();

	control!: AbstractControl;
	parentForm!: FormGroup;
	value: number | null = null;
	disabled = false;

	private onChange = (value: any) => {};
	private onTouched = () => {};

	constructor(
		@Optional()
		@Inject(ControlContainer)
		private readonly controlContainer: ControlContainer
	) {}

	ngOnInit() {
		if (this.formControlName() && this.controlContainer) {
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
		const input = event.target as HTMLInputElement;
		this.value = input.value === '' ? null : input.valueAsNumber;
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
