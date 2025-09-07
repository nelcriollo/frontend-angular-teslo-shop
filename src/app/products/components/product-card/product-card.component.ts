import { SlicePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductImagePipe } from '@products/pipe/product-image.pipe';
import { FileProductService } from '@products/services/file-product.service';

@Component({
	selector: 'product-card',
	standalone: true,
	imports: [RouterLink, SlicePipe, ProductImagePipe],
	templateUrl: './product-card.component.html',
	styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
	private readonly fileProductService = inject(FileProductService);

	producto = input.required<Product>();

	imageUrl = computed(() => this.fileProductService.getImageProduct(this.producto().images[0]));
}
