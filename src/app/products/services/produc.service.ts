import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { ProductResponse, Product, Gender } from '../interfaces/product-response.interface';
import { environment } from 'src/environments/environment';
import { User } from '@auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

interface Options {
	limit?: number;
	offset?: number;
	gender?: string;
}

const EmptyProduct: Product = {
	id: 'new',
	title: '',
	price: 0,
	description: '',
	slug: '',
	stock: 0,
	sizes: [],
	gender: Gender.Men as Gender,
	tags: [],
	images: [],
	user: {} as User,
};

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	private readonly http = inject(HttpClient);

	private readonly productsCache = new Map<string, ProductResponse>();
	private readonly productCache = new Map<string, Product>();

	// Service methods
	getProducts(options: Options): Observable<ProductResponse> {
		const { limit = 12, offset = 0, gender = '' } = options;

		const key = `${limit}-${offset}-${gender}`;
		if (this.productsCache.has(key)) {
			return of(this.productsCache.get(key)!);
		}

		return this.http
			.get<ProductResponse>(`${baseUrl}/products`, {
				params: {
					limit,
					offset,
					gender,
				},
			})
			.pipe(
				tap((response) => {
					this.productsCache.set(key, response);
				})
			);
	}

	getProductByIdSlug(idSlug: string): Observable<Product> {
		if (this.productCache.has(idSlug)) {
			return of(this.productCache.get(idSlug)!);
		}
		return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
			tap((response) => {
				this.productCache.set(idSlug, response);
			})
		);
	}

	getProductById(id: string): Observable<Product> {
		if (id == 'new') return of(EmptyProduct);

		if (this.productCache.has(id)) {
			return of(this.productCache.get(id)!);
		}
		return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
			tap((response) => {
				this.productCache.set(id, response);
			})
		);
	}

	createProduct(productLike: Partial<Product>, imagesFileList?: FileList) {
		const currentImages = productLike.images ?? [];

		return this.upLoadImages(imagesFileList).pipe(
			map((imagesNames) => ({
				...productLike,
				images: [...currentImages, ...imagesNames],
			})),
			switchMap((updateProductLike) =>
				this.http.post<Product>(`${baseUrl}/products`, updateProductLike)
			),
			tap((product) => this.updateProductCache(product))
		);
	}

	updateProduct(
		id: string,
		productLike: Partial<Product>,
		imagesFileList?: FileList
	): Observable<Product> {
		const currentImages = productLike.images ?? [];

		return this.upLoadImages(imagesFileList).pipe(
			map((imagesNames) => ({
				...productLike,
				images: [...currentImages, ...imagesNames],
			})),
			switchMap((updateProductLike) =>
				this.http.patch<Product>(`${baseUrl}/products/${id}`, updateProductLike)
			),
			tap((product) => this.updateProductCache(product))
		);
	}

	updateProductCache(product: Product) {
		const productId = product.id;
		this.productCache.set(productId, product);

		this.productsCache.forEach((productResponse) => {
			productResponse.products = productResponse.products.map((currentProduct) => {
				return currentProduct.id === product.id ? product : currentProduct;
			});
		});
	}

	//Tome un FileList y lo suba
	upLoadImages(images?: FileList): Observable<string[]> {
		if (!images) return of([]);

		const upLoadObservable = Array.from(images).map((image) => this.upLoadImage(image));

		return forkJoin(upLoadObservable);
	}

	upLoadImage(imageFile: File): Observable<string> {
		const formData = new FormData();
		formData.append('file', imageFile);

		return this.http
			.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
			.pipe(map((res) => res.fileName));
	}
}
