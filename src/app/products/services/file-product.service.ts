import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

@Injectable({
	providedIn: 'root',
})
export class FileProductService {
	private readonly http = inject(HttpClient);

	// Service methods

	getImageProduct(nameImage: string): Observable<any> {
		return this.http.get<any>(`${baseUrl}/api/endpoint/${nameImage}`);
	}
}
