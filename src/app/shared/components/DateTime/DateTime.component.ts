import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { Tools } from '../../service/Tools.service';
import { NgIf, NgStyle } from '@angular/common';
import { CalendarModule, LocaleSettings } from 'primeng/calendar';

@Component({
  selector: 'app-DateTime',
  templateUrl: './DateTime.component.html',
  styleUrls: ['./DateTime.component.css'],
  standalone: true,
  imports: [DatePickerModule, FormsModule, CalendarModule,NgIf]
})
export class DateTimeComponent implements OnInit {

  @Input() maxDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() dateFormat: string = "";
  @Input() saveTempInput: any = null;
  @Input() hourFormat: string = "24";
  @Input() selectedDate: any = null
  @Input() showTime: boolean = false
  @Input() showOnFocus: boolean = false
  @Input() ShowMode: boolean = false
  @Input() ShowModeFormat: string = "YYYY-MM-DD"
  @Input() selectOnFocus: boolean = false
  @Input() showTimeOnly: boolean = false
  @Input() forceMaxOrEqualDay: boolean = false
  @Input() view: 'date' | 'month' | 'year' = "date"
  @Input() placeholder: string = "أكتب التاريخ ..."
  @Output() selectedDateChange: EventEmitter<any> = new EventEmitter()
  constructor(public _tools: Tools, private el: ElementRef<HTMLElement>) { }

  ngOnInit() {
    if (this.saveTempInput) {
      this.selectedDate = this._tools.DateTime.getDataFromJson(this._tools.getInputLabel(this.saveTempInput))
      this.ngOnChanges()
      this.change(this.selectedDate)
    }
  }
  ngAfterViewInit() {
    if (this.selectOnFocus) {
      this._tools.waitExecuteFunction(100, () => {
        let input = this.el.nativeElement.querySelector("[pinputtext]") as HTMLElement
        input.addEventListener("focus", (e) => {
          (input as any).select();
        })
      });
    }
  }
  ngOnChanges() {
    if (this.showTime || this.showTimeOnly) {
      if (typeof this.selectedDate == "string") {
        //2025-04-23T18:23:00
        this.selectedDate = this._tools.DateTime.getDataFromJson(this.selectedDate);
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
      if (this.saveTempInput != null) this._tools.saveInputInLabel(this.saveTempInput, e)
      if (this.showTime || this.showTimeOnly) {
        this.selectedDateChange.emit(this._tools.DateTime.getValueJsonWithGMT(e))
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


}

