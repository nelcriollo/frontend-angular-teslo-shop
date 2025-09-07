import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { InitialsPipe } from '@store-front/pipe/initials.pipe';

@Component({
	selector: 'front-navbar',
	standalone: true,
	imports: [RouterLink, RouterLinkActive, UpperCasePipe, TitleCasePipe, InitialsPipe],
	templateUrl: './front-navbar.component.html',
	styleUrl: './front-navbar.component.css',
})
export class FrontNavbarComponent {
	authService = inject(AuthService);

	isAuthenticated = computed(() => this.authService.authStatus() === 'authenticated');
	isNotAuthenticated = computed(() => this.authService.authStatus() === 'no-authenticated');
	isChecking = computed(() => this.authService.authStatus() === 'checking');
	isAdmin = computed(() => this.authService.isAdmin());
}
