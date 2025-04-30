import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NaveComponent } from '../Nave/Nave.component';
import { Tools } from '../../../shared/service/Tools';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css'],
  standalone: true,
  imports: [ButtonModule]
})
export class HeaderComponent implements OnInit {
  @Input('Nave') _Nave!: NaveComponent
  constructor(public _tools: Tools, private _router: Router) { }

  ngOnInit() {
    var userData = localStorage.getItem("logInfo")
    if (userData != null) {
      this._tools._LoginName=JSON.parse(decodeURIComponent(userData)).NAME
    }
  }
  openNave() {
    this._Nave.showNave = true
  }
  logOut() {
    localStorage.removeItem("logInfo")
    this._router.navigate(['Login'])
  }
}
