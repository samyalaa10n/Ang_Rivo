import { Component, OnInit } from '@angular/core';
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Tools } from '../../../shared/service/Tools.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css'],
  imports: [FormsModule, InputTextModule, ButtonModule]
})
export class LoginComponent implements OnInit {
  logInfo = { NAME: "", PASSWORD: "" }

  constructor(private _tools: Tools, private _router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("logInfo") != null) {
      this._router.navigate(['Main', 'Home'])
    }
  }
  async login() {
    this._tools.Network.postAsync("Login", this.logInfo).then((response: any) => {
      if (response) {
        if (response.TOKEN != "" && response.TOKEN != null) {
          localStorage.setItem("logInfo", JSON.stringify(response));
          this._router.navigate(['Main', 'Home']);
        }
      }
    });
  }

}
