import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductImagePipe } from '@products/pipe/product-image.pipe';

@Component({
	selector: 'product-table',
	imports: [ProductImagePipe, RouterLink, CurrencyPipe],
	templateUrl: './product-table.component.html',
	styleUrl: './product-table.component.css',
})
export class ProductTableComponent {
	products = input.required<Product[]>();
}
