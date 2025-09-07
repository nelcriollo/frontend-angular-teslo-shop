import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const BASE_URL = environment.baseUrl;
@Pipe({
	name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
	transform(value: null | string | string[]): string {
		if (value == null) return './assets/images/no-image.jpg';

		if (typeof value === 'string' && value.startsWith('blob:')) return value;

		if (typeof value === 'string') {
			return `${BASE_URL}/files/product/${value}`;
		}

		const image = value.at(0);
		if (!image) return './assets/images/no-image.jpg';

		return `${BASE_URL}/files/product/${image}`;
	}
}
