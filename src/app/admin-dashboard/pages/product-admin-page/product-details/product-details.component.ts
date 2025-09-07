import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtil } from 'src/app/utils/form-util';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { InputTextComponent } from '@shared/components/input-text/input-text.component';
import { ProductService } from '@products/services/produc.service';
import { Router } from '@angular/router';
import { InputNumberComponent } from '@shared/components/input-number/input-number.component';
import { firstValueFrom } from 'rxjs';

@Component({
	selector: 'product-details',
	imports: [
		ProductCarouselComponent,
		ReactiveFormsModule,
		FormErrorLabelComponent,
		InputTextComponent,
		InputNumberComponent,
	],
	templateUrl: './product-details.component.html',
	styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
	sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
	formUtil = FormUtil;
	imagesFileList: FileList | undefined = undefined;

	router = inject(Router);

	fb = inject(FormBuilder);
	productService = inject(ProductService);

	product = input.required<Product>();

	wasSaved = signal(false);
	tempImages = signal<string[]>([]);

	tempImagesToCarousel = computed(() => {
		const currentProductImages = [...this.product().images, ...this.tempImages()];
		return currentProductImages;
	});

	ngOnInit(): void {
		this.setFormValue(this.product());
	}

	productForm = this.fb.group({
		title: [null, [Validators.required]],
		slug: [null, [Validators.required]],
		description: [null, [Validators.required]],
		price: [0, [Validators.required, Validators.min(0)]],
		stock: [0, [Validators.required, Validators.min(0)]],
		tags: ['', [Validators.required]],
		gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
		sizes: [[''], [Validators.required]],
		images: [[]],
	});

	setFormValue(formLike: Partial<Product>) {
		this.productForm.reset(this.product() as any);
		this.productForm.patchValue({ tags: formLike.tags?.join(',') });
	}

	onSizeToggle(size: string) {
		const currentSizes = this.productForm.value.sizes ?? [];
		if (currentSizes.includes(size)) {
			currentSizes.splice(currentSizes.indexOf(size), 1);
		} else {
			currentSizes.push(size);
		}
		this.productForm.patchValue({ sizes: currentSizes });
	}

	async onSubmit() {
		const forValue = this.productForm.value;
		const isValid = this.productForm.valid;
		this.productForm.markAllAsTouched();

		if (!isValid) return;

		const productLike: Partial<Product> = {
			...(forValue as any),
			tags: forValue.tags
				?.toLocaleLowerCase()
				.split(',')
				.map((tag) => tag.trim() ?? []),
		};

		if (this.product().id == 'new') {
			const producto = await firstValueFrom(
				this.productService.createProduct(productLike, this.imagesFileList)
			);

			this.router.navigate(['admin/products', producto.id]);
		} else {
			firstValueFrom(
				this.productService.updateProduct(this.product().id, productLike, this.imagesFileList)
			);
		}
		this.wasSaved.set(true);

		setTimeout(() => {
			this.wasSaved.set(false);
		}, 2000);
	}

	//Imagenes
	onFilesChanged(event: Event) {
		const fileList = (event.target as HTMLInputElement).files;
		this.imagesFileList = fileList!;
		this.tempImages.set([]);
		const imageUrls = Array.from(fileList ?? []).map((file) => URL.createObjectURL(file));
		this.tempImages.set(imageUrls);
	}
}
