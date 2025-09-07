import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { FormUtil } from 'src/app/utils/form-util';

@Component({
	selector: 'app-register-page',
	imports: [ReactiveFormsModule],
	templateUrl: './register-page.component.html',
	styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
	fb = inject(FormBuilder);
	router = inject(Router);
	authService = inject(AuthService);

	formUtil = FormUtil;

	hasError = signal(false);
	isPosting = signal(false);

	myForm = this.fb.group({
		fullName: ['', [Validators.required, Validators.pattern(FormUtil.namePattern)]],
		email: ['', [Validators.required, Validators.pattern(FormUtil.emailPattern)]],
		password: ['', [Validators.required, Validators.minLength(6)]],
	});

	onSubmit() {
		if (this.myForm.invalid) {
			this.hasError.set(true);
			setTimeout(() => {
				this.hasError.set(false);
			}, 2000);
			return this.myForm.markAllAsTouched();
		}

		const { fullName, email, password } = this.myForm.value;

		this.authService.registerUser(fullName!, email!, password!).subscribe((hasRegistered) => {
			if (hasRegistered) {
				this.router.navigateByUrl('/');
				return;
			}

			this.hasError.set(true);
			setTimeout(() => {
				this.hasError.set(false);
			}, 2000);
		});
	}
}
