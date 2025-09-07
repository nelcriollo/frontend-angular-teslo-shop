import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@products/services/produc.service';
import { map } from 'rxjs';
import { ProductDetailsComponent } from './product-details/product-details.component';

@Component({
	selector: 'app-product-admin-page',
	imports: [ProductDetailsComponent],
	templateUrl: './product-admin-page.component.html',
	styleUrl: './product-admin-page.component.css',
})
export class ProductAdminPageComponent {
	productService = inject(ProductService);
	activeRoute = inject(ActivatedRoute);
	router = inject(Router);

	productId = toSignal(this.activeRoute.paramMap.pipe(map((params) => params.get('id') ?? '')));

	productRxResource = rxResource({
		request: () => ({ id: this.productId() }),
		loader: ({ request }) => {
			return this.productService.getProductById(request.id!);
		},
	});

	rederictEffect = effect(() => {
		if (this.productRxResource.error()) {
			this.router.navigateByUrl('/admin/products');
		}
	});
}
