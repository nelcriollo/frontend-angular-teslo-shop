import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

async function sleep() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, 2000);
	});
}

export class FormUtil {
	//EXPRESIONES REGULARES
	static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
	static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
	static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

	//VALIDACIONES
	static isValidField(form: FormGroup, field: string): boolean | null {
		return form.controls[field].errors && form.controls[field].touched;
	}

	static getFieldError(form: FormGroup, fieldName: string): string | null {
		if (!form.controls[fieldName].errors) return null;

		const errors = form.controls[fieldName].errors ?? {};

		return FormUtil.getMessageError(errors);
	}

	static isValidFieldInFormArray(formArray: FormArray, index: number) {
		return formArray.controls[index].errors && formArray.controls[index].touched;
	}
	static getFieldErrorInFormArray(formArray: FormArray, index: number): string | null {
		if (!formArray.controls[index].errors) return null;

		const errors = formArray.controls[index].errors ?? {};

		return FormUtil.getMessageError(errors);
	}

	static isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string): ValidationErrors | null {
		return (formGroup: AbstractControl) => {
			const fieldOneValue = formGroup.get(fieldOne)?.value;
			const fieldTwoValue = formGroup.get(fieldTwo)?.value;

			return fieldOneValue == fieldTwoValue ? null : { passwordNotEqual: true };
		};
	}

	static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
		await sleep();

		if (control.value === 'holamundo@gmail.com') return { emailTaken: true };

		return null;
	}

	static notStrider(control: AbstractControl): ValidationErrors | null {
		if (control.value === 'Strider') return { notStrider: true };

		return null;
	}

	static getMessageError(errors: ValidationErrors): string | null {
		for (const key of Object.keys(errors)) {
			switch (key) {
				case 'required':
					return 'El campo es requerido';
				case 'minlength':
					return `El campo debe de tener al menos ${errors['minlength'].requiredLength} caracteres`;
				case 'min':
					return `El campo debe de ser mayor o igual a ${errors['min'].min}`;
				case 'email':
					return 'El campo debe de ser un email válido';
				case 'emailTaken':
					return 'El email ya está en uso';
				case 'pattern':
					if (errors['pattern'].requiredPattern === FormUtil.namePattern) {
						return 'El campo debe de tener un formato válido de nombre y apellido';
					} else if (errors['pattern'].requiredPattern === FormUtil.emailPattern) {
						return 'El campo debe de ser un formato válido de email';
					} else {
						return 'El campo no tiene el formato requerido';
					}
				case 'notStrider':
					return 'El username no puede ser Strider';
				case 'passwordNotEqual':
					return 'Las contraseñas deben de ser iguales';
				default:
					return 'Error desconocido';
			}
		}
		return null;
	}
}
