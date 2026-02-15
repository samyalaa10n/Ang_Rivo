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
  logInfo = { NAME: "", PASSWORD: "" ,DEVICE_TYPE:this.getDeviceType(),OPERATING_SYSTEM:this.getOperatingSystem(),BROWSER:this.getBrowserName()};

  constructor(private _tools: Tools, private _router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("logInfo") != null) {
      this._router.navigate(['Main'])
    }

  }
  async login() {
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
  
  getDeviceType() {
    const ua = navigator.userAgent;

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "Tablet";
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "Mobile";
    }
    return "Desktop";
  }
  getOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Windows
    if (userAgent.indexOf("Win") !== -1) return "Windows";

    // Mac
    if (userAgent.indexOf("Mac") !== -1) return "MacOS";

    // iOS
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any)?.MSStream) return "iOS";

    // Android
    if (userAgent.indexOf("Android") !== -1) return "Android";

    // Linux
    if (userAgent.indexOf("Linux") !== -1) return "Linux";

    return "Unknown";
  }
  getBrowserName() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    
    if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        browserName = "Opera";
    } else if (userAgent.indexOf("Trident") > -1) {
        browserName = "Internet Explorer";
    } else if (userAgent.indexOf("Edge") > -1) {
        browserName = "Edge (Legacy)";
    } else if (userAgent.indexOf("Edg") > -1) {
        browserName = "Edge (Chromium)";
    } else if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
    }
    
    return browserName;
}

}
