import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NaveComponent } from '../Nave/Nave.component';
import { Tools } from '../../../shared/service/Tools.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css'],
  standalone: true,
  imports: [ButtonModule, RouterLink, NgIf]
})
export class HeaderComponent implements OnInit {

  SignalMessage: BehaviorSubject<string> = new BehaviorSubject<string>("");
  constructor(public _tools: Tools, private _router: Router) { }

  ngOnInit() {
    var userData = localStorage.getItem("logInfo")
    if (userData != null) {
      this._tools.Network._LoginName = JSON.parse(userData)?.NAME
    }
    else {
      this._tools.Network._LoginName = "";
    }
    this.SignalMessage.subscribe(msg => {
      if (msg != "") {
        this._tools.Toaster.showInfo(msg);
      }
    })

  }
  openNave() {
    this._tools._LinkComponent.next("open")
  }
  logOut() {
    localStorage.removeItem("logInfo")
    this._router.navigate(['Login'])
  }
  LogIn() {
    this._router.navigate(['Login'])
  }
  connect() {
    if (!this._tools.transfareSherdData.sherdMood && this._tools.Network.hubConnection == undefined || this._tools.Network.hubConnection?.state == "Disconnected") {
      this._tools.Network.startConnection();
      this._tools.Network.addMessageListener("LoadingText", (user: string, message: string) => {
        // console.log("Loading Message Received:", user, message);
        this.SignalMessage.next(message)
        this._tools.Loading.text = message;
      })
    }
  }
}
