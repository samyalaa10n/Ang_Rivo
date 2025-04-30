import { Component, OnInit } from '@angular/core';
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Tools } from '../../../shared/service/Tools';
import { Router } from '@angular/router';


@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css'],
  imports: [InputLabelComponent, FormsModule, InputTextModule, ButtonModule]
})
export class LoginComponent implements OnInit {
  logInfo = { USER_NAME: "", PASSWORD: "" }
  constructor(private _tools: Tools, private _router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("logInfo") != null) {
      this._router.navigate(['Main', 'Home'])
    }
  }
  async login() {
    let response: any = await this._tools.postAsync('Login/Log', this.logInfo)
    if (response) {
      if (response.SUCCESS) {
        console.log(response)
        this._tools._LoginName=response.USER.NAME;
        localStorage.setItem("logInfo", encodeURIComponent(JSON.stringify(response.USER)))
        this._router.navigate(['Main', 'Home'])
      }
      else {
        this._tools.Toaster.showError(response.MESSAGE)
      }
    }
  }
}
