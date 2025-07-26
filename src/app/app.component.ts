import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataGridComponent } from "./shared/components/dataGrid/dataGrid.component";
import { PrimeNG } from 'primeng/config'
import { Tools } from './shared/service/Tools.service';
import { ToasterComponent } from "./shared/components/Toaster/Toaster.component";
import { DatePipe } from '@angular/common';
import { LoadingComponent } from './shared/components/Loading/Loading.component';
import { PrintComponent } from "./shared/components/print/print.component";
import { PrintService } from './shared/service/Print.service';
import { ConfermationComponent } from "./shared/components/Confermation/Confermation.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent, LoadingComponent, PrintComponent, ConfermationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DatePipe],
})
export class AppComponent {
  
  title = 'R.App.F';
  constructor(private primeng: PrimeNG, private _tools: Tools,private _dateFormat: DatePipe) {

  }
  ngOnInit() {
    this.primeng.setTranslation(this._tools.DateTime.Date_Data);

    this.primeng.zIndex = {
      modal: 1100,    // dialog, sidebar
      overlay: 1000,  // dropdown, overlaypanel
      menu: 1000,     // overlay menus
      tooltip: 1100   // tooltip
    };
    this._tools.DateTime._dateFormat=this._dateFormat;
  }
  selectData() {
  }
  ngAfterViewInit() {
  }
}
