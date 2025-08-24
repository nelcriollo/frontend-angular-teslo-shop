import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'front-navbar',
	standalone: true,
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './front-navbar.component.html',
	styleUrl: './front-navbar.component.css',
})
export class FrontNavbarComponent {}
