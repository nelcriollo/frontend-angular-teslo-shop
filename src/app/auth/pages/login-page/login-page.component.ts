import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtil } from 'src/app/utils/form-util';
import { AuthService } from '@auth/services/auth.service';

@Component({
	selector: 'app-login-page',
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: './login-page.component.html',
	styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
	fb = inject(FormBuilder);
	authService = inject(AuthService);
	route = inject(Router);

	formUtil = FormUtil;

	hasError = signal(false);
	isPosting = signal(false);

	myForm = this.fb.group({
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

		const { email = '', password = '' } = this.myForm.value;

		this.authService.login(email!, password!).subscribe((isAuthenticated) => {
			if (isAuthenticated) {
				this.route.navigateByUrl('/');
				return;
			}

			this.hasError.set(true);
			setTimeout(() => {
				this.hasError.set(false);
			}, 2000);
		});
	}
}
