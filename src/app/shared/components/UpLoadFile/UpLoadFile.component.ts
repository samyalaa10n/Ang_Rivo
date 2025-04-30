import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-UpLoadFile',
  templateUrl: './UpLoadFile.component.html',
  styleUrls: ['./UpLoadFile.component.css'],
  imports:[NgIf]
})
export class UpLoadFileComponent implements OnInit {

  @Input() Header:string="";
  @Input() pathFile:string|null=null;
  @Output()pathFileChange:EventEmitter<any>=new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
