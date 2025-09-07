import { Component, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/produc.service';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';

@Component({
	selector: 'app-product-page',
	standalone: true,
	imports: [ProductCarouselComponent],
	templateUrl: './product-page.component.html',
	styleUrl: './product-page.component.css',
})
export class ProductPageComponent {
	productService = inject(ProductService);
	activeRoute = inject(ActivatedRoute);

	productIdSlug = linkedSignal(() => this.activeRoute.snapshot.paramMap.get('idSlug') ?? '');

	rxResourceProduct = rxResource({
		request: () => ({ idSlug: this.productIdSlug() }),
		loader: ({ request }) => {
			return this.productService.getProductByIdSlug(request.idSlug);
		},
	});
}
