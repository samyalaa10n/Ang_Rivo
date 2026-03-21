import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialog } from "primeng/dialog";


@Component({
  selector: 'app-Dialog',
  templateUrl: './Dialog.component.html',
  styleUrls: ['./Dialog.component.css'],
  standalone:true,
  imports: [Dialog]
})
export class DialogComponent implements OnInit {

  @Input() appendTo: string = ""
  @Input() modal: boolean = true;
  @Input() visible: boolean = false;
  @Input() closable: boolean = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter()
  constructor() { }

  ngOnInit() {
  }

}
