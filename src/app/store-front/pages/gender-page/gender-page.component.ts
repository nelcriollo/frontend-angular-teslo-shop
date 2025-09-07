import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductService } from '@products/services/produc.service';
import { map } from 'rxjs';
import { Product } from '@products/interfaces/product-response.interface';
import { I18nPluralPipe, I18nSelectPipe, TitleCasePipe } from '@angular/common';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
	selector: 'app-gender-page',
	standalone: true,
	imports: [
		ProductCardComponent,
		I18nPluralPipe,
		I18nSelectPipe,
		TitleCasePipe,
		PaginationComponent,
	],
	templateUrl: './gender-page.component.html',
	styleUrl: './gender-page.component.css',
})
export class GenderPageComponent {
	activeRoute = inject(ActivatedRoute);
	productService = inject(ProductService);
	paginationService = inject(PaginationService);

	// i18n Select Singular
	genderMap = {
		men: 'hombres',
		women: 'mujeres',
		kid: 'niños',
		unisex: 'unisex',
	};

	// i18n Select Plural
	productCountMap = {
		'=0': 'No hay productos',
		'=1': 'producto',
		other: 'productos',
	};

	genderProductsMap = {
		men: {
			'=0': 'No hay productos para Hombres',
			'=1': '1 Producto para Hombres',
			other: '# Productos para Hombres',
		},
		women: {
			'=0': 'No hay productos para Mujeres',
			'=1': '1 Producto para Mujeres',
			other: '# Productos para Mujeres',
		},
		kid: {
			'=0': 'No hay productos para Niños',
			'=1': '1 Producto para Niños',
			other: '# Productos para Niños',
		},
	};

	gender = toSignal(this.activeRoute.params.pipe(map(({ gender }) => gender)));
	products = signal<Product[]>([]);
	currentPage = this.paginationService.currentPage;

	rxResourceProductsGender = rxResource({
		request: () => ({ gender: this.gender(), page: this.currentPage() }),
		loader: ({ request }) => {
			return this.productService.getProducts({
				offset: (request.page - 1) * 12,
				gender: request.gender,
			});
		},
	});
}
