import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-pagination',
	imports: [RouterLink],
	templateUrl: './pagination.component.html',
	styleUrl: './pagination.component.css',
})
export class PaginationComponent {
	pages = input.required<number>();
	currentPage = input<number>(1);

	activePage = linkedSignal(this.currentPage);

	getPagesList = computed(() => {
		return Array.from({ length: this.pages() }, (_, i) => i + 1);
	});
}
