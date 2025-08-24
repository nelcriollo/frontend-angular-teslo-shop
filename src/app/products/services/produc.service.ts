import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ProductResponse } from '../interfaces/product-response.interface';

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:3000/api/products';

	// Service methods
	getProducts(): Observable<ProductResponse> {
		return this.http.get<ProductResponse>(this.apiUrl).pipe(tap(console.log));
	}
}
