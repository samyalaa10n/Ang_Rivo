import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataGridComponent } from "./shared/components/dataGrid/dataGrid.component";
import { PrimeNG } from 'primeng/config'
import { Tools } from './shared/service/Tools';
import { ToasterComponent } from "./shared/components/Toaster/Toaster.component";
import { DatePipe } from '@angular/common';
import { LoadingComponent } from './shared/components/Loading/Loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DatePipe],
})
export class AppComponent {
  title = 'R.App.F';
  constructor(private primeng: PrimeNG, private _tools: Tools,private _dateFormat: DatePipe) {

  }
  ngOnInit() {

    this.primeng.setTranslation({
      dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      dayNamesShort: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
      dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
      monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      today: 'اليوم',
      clear: 'مسح',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'أسبوع',
      firstDayOfWeek: 0
    });

    this.primeng.zIndex = {
      modal: 1100,    // dialog, sidebar
      overlay: 1000,  // dropdown, overlaypanel
      menu: 1000,     // overlay menus
      tooltip: 1100   // tooltip
    };
    this._tools._dateFormat=this._dateFormat;
  }
  selectData() {
  }
  ngAfterViewInit() {
  }
}
