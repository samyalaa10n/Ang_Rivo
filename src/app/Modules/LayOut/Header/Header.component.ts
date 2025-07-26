import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NaveComponent } from '../Nave/Nave.component';
import { Tools } from '../../../shared/service/Tools.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css'],
  standalone: true,
  imports: [ButtonModule,RouterLink]
})
export class HeaderComponent implements OnInit {
  constructor(public _tools: Tools, private _router: Router) { }

  ngOnInit() {
    var userData = localStorage.getItem("logInfo")
    if (userData != null) {
      this._tools.Network._LoginName=JSON.parse(userData).useR_NAME
    }
  }
  openNave() {
    this._tools._LinkComponent.next("open")
  }
  logOut() {
    localStorage.removeItem("logInfo")
    this._router.navigate(['Login'])
  }

  
}
