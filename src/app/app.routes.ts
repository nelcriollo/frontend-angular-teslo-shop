import { Routes } from '@angular/router';
import { IsUserAdmin } from '@admin-dashboard/guards/is-admin.guard';
import { NotAuthenticatedGuardCanMatch } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.routes'),
		canMatch: [NotAuthenticatedGuardCanMatch],
	},
	{
		path: 'admin',
		loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
		canMatch: [IsUserAdmin],
	},
	{
		path: '',
		loadChildren: () => import('./store-front/store-front.routes'),
	},
];
