import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { Tools } from '../../service/Tools.service';
import { Column } from './Column';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appResizableColumn]',
  standalone: true
})
export class PResizableColumnDirective implements AfterViewInit {

  spaceMoved: number = 0;
  startWidth: number = 0;
  starTabletWidth: number = 0;
  divLine!: HTMLElement
  divSpaceColResize!: HTMLElement
  @Output() OnResizeColumn :EventEmitter<any>=new EventEmitter()
  constructor(public el: ElementRef<HTMLElement>,private _tools:Tools,@Inject(PLATFORM_ID) private platformId: Object) {
    
  }
  ngAfterViewInit() {
    this.divSpaceColResize = document.createElement("div")
    this.divSpaceColResize.classList.add('col-resize')
    this.el.nativeElement.appendChild(this.divSpaceColResize)
  }
  @HostListener('mousedown', ['$event'])
  onMouseDown = (e: MouseEvent) => {
    if (e.target == this.divSpaceColResize) {
      this.spaceMoved = e.x;
      this.OnResizeColumn.emit(true);
      this.startWidth = this.el.nativeElement.getBoundingClientRect().width;
      this.starTabletWidth = this.el.nativeElement.parentElement?.parentElement?.parentElement?.getBoundingClientRect().width ?? 0;
      window.addEventListener("mousemove", this.onMouseMove)
      window.addEventListener("mouseup", this.onMouseUp)
      this.addLineElement(e.x);
    }
  }
  onMouseMove = (e: MouseEvent) => {
    this.divLine.style.left = e.x + 'px';
    this.OnResizeColumn.emit(true);
    let table = this.el.nativeElement.parentElement?.parentElement?.parentElement
    if (e.pageX > this.spaceMoved) {
      this.el.nativeElement.style.width = this.startWidth - (e.x - this.spaceMoved) + "px";
      if (table) table.style.width = this.starTabletWidth - (e.x - this.spaceMoved) + "px";
    }
    else {
      this.el.nativeElement.style.width = this.startWidth + (this.spaceMoved - e.x) + "px";
      if (table) table.style.width = this.starTabletWidth + (this.spaceMoved - e.x) + "px";
    }
  }
  onMouseUp = (e: MouseEvent) => {
    let table = this.el.nativeElement.parentElement?.parentElement?.parentElement
    if (e.pageX > this.spaceMoved) {
      this.OnResizeColumn.emit(false);
      this.el.nativeElement.style.width = this.startWidth - (e.x - this.spaceMoved) + "px";
      if (table) table.style.width = this.starTabletWidth - (e.x - this.spaceMoved) + "px";
    }
    else {
      this.el.nativeElement.style.width = this.startWidth + (this.spaceMoved - e.x) + "px";
      if (table) table.style.width = this.starTabletWidth + (this.spaceMoved - e.x) + "px";
    }
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mousedown", this.onMouseDown)
    window.removeEventListener("mouseup", this.onMouseUp)
    this.removeElement();
  }
  addLineElement(positionMouse: number) {
    // this.divLine.onmouseleave=(e)=>{
    //   this.removeElement()
    // }
    if (document) {
      this.divLine = document.createElement("div")
      this.divLine.classList.add("line")
      this.divLine.style.left = positionMouse + 'px';
      this.el.nativeElement?.parentElement?.parentElement?.parentElement?.parentElement?.classList.add('no-select')
      document.body.appendChild(this.divLine)
    }
  }
  removeElement() {
    this.divLine.remove();
    this.el.nativeElement?.parentElement?.parentElement?.parentElement?.parentElement?.classList.remove('no-select')
  }
}
