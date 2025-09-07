import {
	AfterViewInit,
	Component,
	ElementRef,
	input,
	OnChanges,
	SimpleChanges,
	viewChild,
} from '@angular/core';

// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '../../pipe/product-image.pipe';

@Component({
	selector: 'product-carousel',
	imports: [ProductImagePipe],
	templateUrl: './product-carousel.component.html',
	styleUrl: './product-carousel.component.css',
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {
	swiperContainer = viewChild.required<ElementRef>('swiperContainer');
	swiper: Swiper | null = null;

	images = input.required<string[]>();

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['images'].firstChange) return;

		if (!this.swiper) return;

		this.swiper.destroy(true, true);

		const paginationElement: HTMLDivElement =
			this.swiperContainer().nativeElement?.querySelector('.swiper-pagination');
		paginationElement.innerHTML = '';

		setTimeout(() => {
			this.swiperInit();
		}, 1000);
	}

	ngAfterViewInit() {
		this.swiperInit();
	}

	swiperInit() {
		const swiperElement = this.swiperContainer().nativeElement;
		if (!swiperElement) return;

		this.swiper = new Swiper(swiperElement, {
			// Optional parameters
			direction: 'horizontal',
			loop: true,

			// add los modules
			modules: [Navigation, Pagination],

			// If we need pagination
			pagination: {
				el: '.swiper-pagination',
			},

			// Navigation arrows
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},

			// And if we need scrollbar
			scrollbar: {
				el: '.swiper-scrollbar',
			},
		});
	}
}
