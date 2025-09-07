import { Component, inject, signal } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductService } from '@products/services/produc.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductResponse } from '@products/interfaces/product-response.interface';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
	selector: 'app-home-page',
	standalone: true,
	imports: [ProductCardComponent, PaginationComponent],
	templateUrl: './home-page.component.html',
	styleUrl: './home-page.component.css',
})
export class HomePageComponent {
	private readonly productService = inject(ProductService);
	private readonly paginationService = inject(PaginationService);

	products = signal<ProductResponse | null>(null);
	currentPage = this.paginationService.currentPage;

	productsResource = rxResource({
		request: () => ({ page: this.currentPage() }),
		loader: ({ request }) => {
			return this.productService.getProducts({
				offset: (request.page - 1) * 12,
			});
		},
	});
}
