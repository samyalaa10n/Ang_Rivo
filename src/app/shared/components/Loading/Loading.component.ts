import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tools } from '../../service/Tools';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Loading',
  templateUrl: './Loading.component.html',
  styleUrls: ['./Loading.component.css'],
  standalone: true,
  imports: [ButtonModule,NgIf]
})
export class LoadingComponent implements OnInit {

  showLoading:boolean=false;
  constructor(public _tools:Tools) {
    _tools.Loading=this;
   }

  ngOnInit() {

  }
  startLoading()
  {
    this.showLoading=true;
  }
  stopLoading()
  {
    this.showLoading=false;
  }
}
