import { Component, OnInit } from '@angular/core';
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Tools } from '../../../shared/service/Tools.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css'],
  imports: [FormsModule, InputTextModule, ButtonModule, RouterLink]
})
export class LoginComponent implements OnInit {
  logInfo = { NAME: "", PASSWORD: "" }

  constructor(private _tools: Tools, private _router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("logInfo") != null) {
      this._router.navigate(['Main'])
    }

  }
  async login() {
    debugger
    this._tools.Network.postAsync("Login", this.logInfo).then((response: any) => {
      if (response) {
        if (response.TOKEN != "" && response.TOKEN != null) {
          localStorage.setItem("logInfo", JSON.stringify(response));
          this._router.navigate(['Main']);
        }
      }
    });
  }

  togglePassword() {
    const passwordInput:any = document.getElementById('password');
    const toggle:any = document.querySelector('.password-toggle');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggle.textContent = '🙈';
    } else {
      passwordInput.type = 'password';
      toggle.textContent = '👁️';
    }
  }
}
