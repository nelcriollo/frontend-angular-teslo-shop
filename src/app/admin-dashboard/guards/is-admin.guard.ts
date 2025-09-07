import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const IsUserAdmin: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	await firstValueFrom(authService.checkAthStatus());

	if (!authService.isAdmin()) {
		router.navigateByUrl('/');
		return false;
	}

	return true;
};
