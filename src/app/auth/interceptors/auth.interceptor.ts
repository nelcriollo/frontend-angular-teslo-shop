import { HttpHandlerFn } from '@angular/common/http';
import { HttpRequest } from '@angular/common/module.d-CnjH8Dlt';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
	const token = inject(AuthService).token();
	const newReq = req.clone({
		headers: req.headers.append('Authorization', `Bearer ${token}`),
	});
	return next(newReq);
}
