import { Component, Input, OnInit } from '@angular/core';
import { Tools } from '../../../shared/service/Tools.service';
import { NaveComponent } from '../Nave/Nave.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(public _tools: Tools, private _router: Router) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
  }
  LogIn()
  {
    this._router.navigate(['Login'])
  }
}
