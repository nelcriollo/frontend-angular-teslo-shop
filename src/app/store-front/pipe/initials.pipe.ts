import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'initials',
})
export class InitialsPipe implements PipeTransform {
	transform(value: string): string {
		if (!value) return '';
		return value
			.split(' ')
			.filter((word) => word.length > 0)
			.map((word) => word[0].toUpperCase())
			.join('');
	}
}
