import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { Tools } from '../../service/Tools';
import { NgStyle } from '@angular/common';
import { CalendarModule, LocaleSettings } from 'primeng/calendar';

@Component({
  selector: 'app-DateTime',
  templateUrl: './DateTime.component.html',
  styleUrls: ['./DateTime.component.css'],
  standalone: true,
  imports: [DatePickerModule, FormsModule, NgStyle,CalendarModule]
})
export class DateTimeComponent implements OnInit {

  @Input() maxDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() dateFormat: string = "";
  @Input() hourFormat: string = "24";
  @Input() selectedDate: any = null
  @Input() showTime: boolean = false
  @Input() showTimeOnly: boolean = false
  @Input() forceMaxOrEqualDay: boolean = false
  @Input() view: 'date' | 'month' | 'year' = "date"
  @Input() placeholder: string = "أكتب التاريخ ..."
  @Output() selectedDateChange: EventEmitter<any> = new EventEmitter()
  constructor(private _tools: Tools, private el: ElementRef<HTMLElement>) { }

  ngOnInit() {

  }
  ngOnChanges() {
    // if (this.showTimeOnly) {
    //   if (this.selectedDate.HOUR != null) {
    //     this.selectedDate = this.getTimeFromValue(this.selectedDate);
    //     return;
    //   }
    // }
    if (this.showTime || this.showTimeOnly) {
      if (typeof this.selectedDate == "string") {
        //2025-04-23T18:23:00
        this.selectedDate = new Date(`${this.selectedDate.split("T")[0]} ${this.selectedDate.split("T")[1]} GMT+3`);
      }
      else {
        this.selectedDate = this.selectedDate;
      }
      return;
    }
    if (this.selectedDate) {
      let text = new Date(this.selectedDate).toLocaleDateString("EN") + " GMT";
      this.selectedDate = new Date(text);
    }

  }
  change(e: Date) {
    if (e != null) {
      // if (this.showTimeOnly) {
      //   this.selectedDateChange.emit(this.getValueFromTime(e));
      //   return;
      // }
      if (this.showTime || this.showTimeOnly) {
        this.selectedDateChange.emit(this.getValueJsonWithGMT(e, 3))
        return;
      }
      let text = new Date(e).toLocaleDateString("EN") + " GMT";
      this.selectedDate = new Date(text);
      if (this.selectedDate != null && this.forceMaxOrEqualDay) {
        let value = new Date(text);
        value.setDate(1)
        let data_now = new Date(new Date().toLocaleDateString("en") + " GMT")
        data_now.setDate(1);
        if (value < data_now) {
          this._tools.Toaster.showError("يجب ادخال تاريخ اكبر من تاريخ الشهر او يساوي")
          this.selectedDate = null;
          return
        }
      }
      this.selectedDateChange.emit(this.selectedDate)
    }
    else {
      this.selectedDateChange.emit(null);
    }
  }
  clear() {
    this.selectedDate = null;
    this.selectedDateChange.emit(null);
  }
  getValueJsonWithGMT(E: Date, TimeGMT = 2) {
    let editHours = (txt: string): string => {
      let endValue = '';
      if ((Number.parseInt(txt) + TimeGMT) < 10) {
        endValue = "0" + ((Number.parseInt(txt) + TimeGMT)).toString();
      }
      else if ((Number.parseInt(txt) + TimeGMT) > 23) {
        endValue = "0" + ((Number.parseInt(txt) + TimeGMT) - 24).toString();
      }
      else {
        endValue = (Number.parseInt(txt) + TimeGMT).toString();
      }
      return endValue;
    }
    let oldJson = E.toJSON();
    let hours = editHours(oldJson.split("T")[1].split(":")[0]);
    oldJson = `${oldJson.split('T')[0]}T${hours}:${oldJson.split("T")[1].split(":")[1]}:${oldJson.split("T")[1].split(":")[2]}`
    console.log(oldJson)
    return oldJson;
  }
  getValueFromTime(e: Date) {
    debugger
    let value: any = { HOUR: null, MINUTE: null }
    value.HOUR = e.getHours();
    value.MINUTE = e.getMinutes();
    return value;
  }
  getTimeFromValue(e: any) {
    let date = new Date(new Date().toLocaleDateString("en") + " GMT")
    date.setHours(e.HOUR);
    date.setMinutes(e.MINUTE);
    return date;
  }
}

