import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from '@products/components/product-table/product-table.component';
import { ProductResponse } from '@products/interfaces/product-response.interface';
import { ProductService } from '@products/services/produc.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-products-admin-page',
	imports: [ProductTableComponent, PaginationComponent, RouterLink],
	templateUrl: './products-admin-page.component.html',
	styleUrl: './products-admin-page.component.css',
})
export class ProductsAdminPageComponent {
	private readonly productService = inject(ProductService);
	private readonly paginationService = inject(PaginationService);

	currentPage = this.paginationService.currentPage;
	productsPerPage = signal(10);

	productsRxResource = rxResource({
		request: () => ({ page: this.currentPage(), limit: this.productsPerPage() }),
		loader: ({ request }) => {
			return this.productService.getProducts({
				limit: request.limit,
				offset: (request.page - 1) * request.limit,
			});
		},
	});
}
