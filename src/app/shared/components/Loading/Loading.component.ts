import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tools } from '../../service/Tools.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Loading',
  templateUrl: './Loading.component.html',
  styleUrls: ['./Loading.component.css'],
  standalone: true,
  imports: [ButtonModule, NgIf]
})
export class LoadingComponent implements OnInit {

  showLoading: boolean = false;
  Req: number = 0;
  constructor(public _tools: Tools) {
    _tools.Loading = this;
    _tools.Network.Loading = this;
  }
  ngOnInit() {

  }
  startLoading() {
    this.Req++;
    this.showLoading = true;
  }
  stopLoading() {
    this.Req--
    if (this.Req <= 0) {
      this.showLoading = false;
      this.Req = 0
    }
  }
}
