import { Component, ElementRef } from '@angular/core';
import { AnimateOnScroll, AnimateOnScrollModule } from 'primeng/animateonscroll';
import { Tools } from '../../service/Tools.service';

@Component({
    selector: 'app-SmoothScrollPages',
    templateUrl: './SmoothScrollPages.component.html',
    styleUrls: ['./SmoothScrollPages.component.css'],
    standalone: true,
    imports: [AnimateOnScrollModule],
})
export class smoothScrollPagesComponent {
    constructor(private _tools: Tools, private el: ElementRef<HTMLElement>) {

    }
    ngAfterViewInit() {
        this._tools.waitExecuteFunction(100, () => {
            const sections = this.el.nativeElement.querySelectorAll(".hidden");
            console.log(sections)
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            }, { threshold: 0.2 });
            sections.forEach(section => {
                observer.observe(section);
            });
        })
    }
}




