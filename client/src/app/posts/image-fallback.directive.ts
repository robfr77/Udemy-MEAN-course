import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appImageFallback]',
})
export class ImageFallbackDirective {
  alreadyRan: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('error') onError() {
    if (!this.alreadyRan) {
      this.el.nativeElement.src = 'https://via.placeholder.com/250?text=Image+Not+Found';
    }

    this.alreadyRan = true;
  }
}