import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

type AuthStatus = 'checking' | 'authenticated' | 'no-authenticated';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly _authStatus = signal<AuthStatus>('checking');
	private readonly _user = signal<User | null>(null);
	private readonly _token = signal<string | null>(localStorage.getItem('token'));

	private readonly http = inject(HttpClient);

	/* -------------------------------------------------------------------------- */
	/*                        PROCESO PARA LA AUTENTICACION                       */
	/* -------------------------------------------------------------------------- */

	checkStatusResource = rxResource({
		loader: () => this.checkAthStatus(),
	});

	authStatus = computed<AuthStatus>(() => {
		if (this._authStatus() === 'checking') return 'checking';

		if (this._user()) return 'authenticated';
		return 'no-authenticated';
	});

	user = computed<User | null>(() => this._user());
	token = computed<string | null>(() => this._token());
	isAdmin = computed(() => this.user()?.roles.includes('admin') ?? false);

	login(email: string, password: string): Observable<boolean> {
		return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, { email, password }).pipe(
			map((resp) => this.handleAuthSucces(resp)),
			catchError((error) => this.handleAuthError(error))
		);
	}

	checkAthStatus(): Observable<boolean> {
		console.log('checkAthStatus - AuthService');
		const token = localStorage.getItem('token');

		if (!token) {
			this.logout();
			return of(false);
		}

		return this.http
			.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
				// headers: {
				// 	Authorization: `Bearer ${token}`, // esto ya no va porque lo inyecta automáticamente  el interceptor  authInterceptor
				// },
			})
			.pipe(
				map((resp) => this.handleAuthSucces(resp)),
				catchError((error) => this.handleAuthError(error))
			);
	}

	logout(): void {
		this._user.set(null);
		this._token.set(null);
		this._authStatus.set('no-authenticated');
		localStorage.removeItem('token');
	}

	private handleAuthSucces(resp: AuthResponse): boolean {
		this._user.set(resp.user);
		this._token.set(resp.token);
		this._authStatus.set('authenticated');

		localStorage.setItem('token', resp.token);
		return true;
	}

	private handleAuthError(error: any): Observable<boolean> {
		this.logout();
		return of(false);
	}

	/* -------------------------------------------------------------------------- */
	/*                             REGISTRO DE USUARIO                            */
	/* -------------------------------------------------------------------------- */

	registerUser(fullName: string, email: string, password: string): Observable<boolean> {
		return this.http
			.post<AuthResponse>(`${baseUrl}/auth/register`, { fullName, email, password })
			.pipe(
				tap((user) => console.log({ user })),
				map((resp) => this.handleAuthSucces(resp)),
				catchError((error) => this.handleAuthError(error))
			);
	}
}
