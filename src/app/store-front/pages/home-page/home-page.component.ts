import { Component, inject, signal } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductService } from '@products/services/produc.service';

@Component({
	selector: 'app-home-page',
	standalone: true,
	imports: [ProductCardComponent],
	templateUrl: './home-page.component.html',
	styleUrl: './home-page.component.css',
})
export class HomePageComponent {
	private readonly productService = inject(ProductService);
	products = signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

	productsResource = resource({
		Request: () => ({}),
		loader: ({ request }) => {
			return this.productService.getProducts();
		},
	});
}
