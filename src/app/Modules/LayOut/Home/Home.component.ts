import { Component, Input, OnInit } from '@angular/core';
import { Tools } from '../../../shared/service/Tools.service';
import { NaveComponent } from '../Nave/Nave.component';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(public _tools: Tools) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
  }
}
